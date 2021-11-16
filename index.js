import { Transformer } from 'koaw-js'
import { createElement } from 'react';
import ReactDOMServer from 'react-dom/server'
import { getAssetFromKV, NotFoundError, MethodNotAllowedError } from '@cloudflare/kv-asset-handler'
import { match } from 'path-to-regexp'
// import { StaticRouter } from 'react-router-dom/server.js'
// import { matchPath } from 'react-router-dom'
// import routes from './pages/routes'

// Static file fetch, for server-rendering
async function handleEvent(event) {
  try {
    return await getAssetFromKV(event, {
      mapRequestToAsset: (request) => {
        let requestURL = new URL(request.url)
        // TODO: use a faster & more exact way to match
        if (!requestURL.pathname) return request;
        if (requestURL.pathname.split("/").reverse()[0].includes(".")) {
          return request;
        } else {
          return new Request(new URL(request.url).origin + '/index.html')
        }
      }
    })
  } catch (e) {
    if (e instanceof NotFoundError) {
      return new Response(null, { status: 404 })
    } else if (e instanceof MethodNotAllowedError) {
      return new Response(null, { status: 405 })
    } else {
      return new Response('An unexpected error occurred', { status: 500 })
    }
  }
}

export function ReactSSRMiddleware(event, routes) {
  return async (ctx) => {
    try {
      const response = await handleEvent(event).catch(e => { console.log(e) });
      ctx.res = await Transformer.responseToCtx(response).catch(e => console.log(e));
      let indexHTML = ctx.res.body;
      if (ctx.res.headers['content-type'] && ctx.res.headers['content-type'].includes('text/html')) {
        // const matchRoute = routes.find(r => matchPath(ctx.req.url.pathname, r.path))
        const matchRoute = routes.find(r => {
          let matchTester = match(r.path);
          if(matchTester(ctx.req.url.pathname)) return r;
          return;
        })
        let prefetchData = {};
        // console.log(matchRoute.component)
        let com;
        if(typeof matchRoute.component === 'function') {
          com = matchRoute.component();
        } else {
          com = matchRoute.component;
        }
        if(typeof com === 'object' && com.default) {
          com = com.default
        }
        if (matchRoute && matchRoute.component && typeof matchRoute.component === 'function' && typeof matchRoute.component().fetchDataOnEdge === 'function') {
          prefetchData = await matchRoute.component().fetchDataOnEdge();
        }
        let appHTML = ReactDOMServer.renderToString(
          createElement(com, { serverProps: {data: prefetchData, location: ctx.req.url.pathname} })
        )
        // populate `#app` element with `appHTML`
        ctx.res.body = indexHTML.replace('<!-- APP_PLACEHOLDER -->', appHTML).replace('<!-- SCRIPT_PLACEHOLDER -->', `<script>window.__INITIAL_DATA__ = ${JSON.stringify({data: prefetchData, location: ctx.req.url.pathname})}</script>`);
      }
    } catch (e) {
      console.log('Error occurs in: ' + event.request.url);
      console.log(e);
      throw e;
    }
    ctx.end();
  }
}

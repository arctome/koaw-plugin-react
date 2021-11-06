import Koaw, { Transformer } from 'koaw-js'
import { getAssetFromKV, NotFoundError, MethodNotAllowedError } from '@cloudflare/kv-asset-handler'
import React from 'react';
import ReactDOMServer from 'react-dom/server'
import App from './app'
import { StaticRouter } from 'react-router-dom/server'
import { matchPath } from 'react-router-dom'
import routes from './routes'

addEventListener('fetch', (event) => {
  const app = new Koaw(event);
  app.use(async (ctx) => {
    try {
      const response = await handleEvent(event).catch(e => { console.log(e) });
      ctx.res = await Transformer.responseToCtx(response).catch(e => console.log(e));
      let indexHTML = ctx.res.body;
      if (ctx.res.headers['content-type'] && ctx.res.headers['content-type'].includes('text/html')) {
        const matchRoute = routes.find(r => matchPath(new URL(event.request.url).pathname, r.path))
        let prefetchData = {};
        let appHTML;
        if (matchRoute && matchRoute.component && typeof matchRoute.component.fetchDataOnEdge === 'function') {
          prefetchData = await matchRoute.component.fetchDataOnEdge();
        }
        appHTML = ReactDOMServer.renderToString(
          <StaticRouter location={event.request.url} >
            <App serverProps={prefetchData} />
          </StaticRouter>
        )
        // populate `#app` element with `appHTML`
        ctx.res.body = indexHTML.replace('<!-- APP_PLACEHOLDER -->', appHTML).replace('<!-- SCRIPT_PLACEHOLDER -->', `<script>window.__INITIAL_DATA__ = ${JSON.stringify(prefetchData)}</script>`);
      }
    } catch (e) {
      console.log('Error occurs in: ' + event.request.url);
      console.log(e);
      throw e;
    }
    ctx.end();
  })

  event.respondWith(app.run())
})

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
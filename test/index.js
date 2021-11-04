import Koaw, { Transformer } from 'koaw-js'
import { getAssetFromKV, NotFoundError, MethodNotAllowedError } from '@cloudflare/kv-asset-handler'
import React from 'react';
import ReactDOMServer from 'react-dom/server'
import App from './react/app'
import { StaticRouter, matchPath } from 'react-router-dom'
import routes from './react/routes'

addEventListener('fetch', (event) => {
  const app = new Koaw(event);
  app.use(async (ctx) => {
    const response = await handleEvent(event).catch(e => { console.log(e) });
    ctx.res = await Transformer.responseToCtx(response).catch(e => console.log(e));
    if (ctx.res.headers['content-type'].includes('text/html')) {
      const matchRoute = routes.find(route => matchPath(new URL(event.request.url).pathname, route));
      let indexHTML = ctx.res.body;
      let prefetchData = {};
      if (matchRoute && matchRoute.component && typeof matchRoute.component.fetchDataOnEdge === 'function') {
        prefetchData = await matchRoute.component.fetchDataOnEdge();
      }
      let appHTML = ReactDOMServer.renderToString(
        <StaticRouter location={event.request.url} staticContext={prefetchData} >
          <App />
        </StaticRouter>
      )
      // populate `#app` element with `appHTML`
      ctx.res.body = indexHTML.replace('<div id="app"></div>', `<div id="app">${appHTML}</div>`).replace('<!-- SCRIPT_PLACEHOLDER -->', `<script>window.__INITIAL_DATA__ = ${JSON.stringify(prefetchData)}</script>`);
    }
    ctx.end();

    // let response = await handleEvent(event);
    // ctx.res = await Transformer.responseToCtx(response).catch(e => console.log(e));
    // if (ctx.res.headers['content-type'].includes('text/html')) {
    //   const matchRoute = routes.find(route => matchPath(event.request.url, route));
    //   let indexHTML = ctx.res.body;
    //   let prefetchData;
    //   let AppComponent = App;
    //   if (matchRoute && matchRoute.component && typeof matchRoute.component.fetchDataOnEdge === 'function') {
    //     prefetchData = await matchRoute.component.fetchDataOnEdge();
    //   }
    //   let appHTML = ReactDOMServer.renderToString(
    //     <StaticRouter location={event.request.url} context={prefetchData}>
    //       <AppComponent />
    //     </StaticRouter>
    //   )
    //   // populate `#app` element with `appHTML`
    //   ctx.res.body = indexHTML.replace('<div id="app"></div>', `<div id="app">${appHTML}</div>`);
    // }
    // ctx.end()
  })

  event.respondWith(app.run())
})

// Static file fetch, for server-rendering
async function handleEvent(event) {
  try {
    return await getAssetFromKV(event, {
      mapRequestToAsset: (request) => {
        const requestURL = new URL(event.request.url)
        // TODO: use a faster & more exact way to match
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
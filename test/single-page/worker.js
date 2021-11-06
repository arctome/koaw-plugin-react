import Koaw, { Transformer } from 'koaw-js'
import { getAssetFromKV, NotFoundError, MethodNotAllowedError } from '@cloudflare/kv-asset-handler'
import React from 'react';
import ReactDOMServer from 'react-dom/server'
import * as App from './app'

addEventListener('fetch', (event) => {
  const app = new Koaw(event);
  app.use(async (ctx) => {
    const response = await handleEvent(event).catch(e => { console.log(e) });
    ctx.res = await Transformer.responseToCtx(response).catch(e => console.log(e));
    if (ctx.res.headers['content-type'].includes('text/html')) {
      try {
        let indexHTML = ctx.res.body;
        let prefetchData = {};
        let AppComponent = App.default;
        if (App && typeof App.fetchDataOnEdge === 'function') {
          prefetchData = await App.fetchDataOnEdge();
        }
        let appHTML = ReactDOMServer.renderToString(
          <AppComponent serverProps={prefetchData} />
        )
        // populate `#app` element with `appHTML`
        ctx.res.body = indexHTML.replace('<!-- APP_PLACEHOLDER -->', appHTML).replace('<!-- SCRIPT_PLACEHOLDER -->', `<script>window.__INITIAL_DATA__ = ${JSON.stringify(prefetchData)}</script>`);
      } catch (e) {
        console.log(e)
      }
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
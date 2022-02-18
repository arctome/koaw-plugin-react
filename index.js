import Koaw, { KoawRouter } from "koaw-js";
import { renderToString } from "react-dom/server.browser"
import App from "./src/App.jsx"

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const app = new Koaw({ request });
        const router = new KoawRouter();

        router.get('/api/example', ctx => {
            const html = `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Vite App From Server</title>
              </head>
              <body>
                <div id="root">${renderToString(App)}</div>
                <script type="module" src="/src/main.jsx"></script>
              </body>
            </html>
            `
            ctx.res.body = html;
            ctx.res.status = 200;
            ctx.end();
        })
        app.use(router.route());
        if (url.pathname.startsWith('/api/')) {
            let response = await app.run();
            // TODO: Will auto fallback to not-found response, need modify.
            return response;
        }
        return env.ASSETS.fetch(request);
    }
}
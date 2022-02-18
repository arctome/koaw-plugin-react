import Koaw, { KoawRouter } from "koaw-js";
import { renderToString } from "react-dom/server.browser"
import App from "./src/App.jsx"

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const app = new Koaw({ request }, {
            debug: true
        });
        const router = new KoawRouter();
        const index_url = new URL(request.url);
        index_url.pathname = "/"
        
        let template = await env.HtmlTpls.get("index.html")
        if(!template) {
            const template_request = await fetch(index_url.href);
            template = await template_request.text();
            env.HtmlTpls.put("index.html", template);
        }

        let external_request = ""
        await fetch('http://jsonplaceholder.typicode.com/todos/1').then(response => response.json())
            .then(json => {
                external_request = JSON.stringify(json)
            })

        router.get('/api/example', ctx => {
            ctx.res.body = template.replace("<!--ssr-outlet-->", renderToString(App)).replace("<!--ssr-data-->", external_request);
            ctx.res.status = 200;
            ctx.res.headers["Content-Type"] = "text/html; charset=utf-8";
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
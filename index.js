import Koaw, { KoawRouter } from "koaw-js";
import { renderToString } from "react-dom/server.browser"
import { matchRoutes } from "react-router-dom"
import routes from "./src/routes"
import RenderToStringWrapper from "./preset/renderToStringWrapper.jsx"

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const app = new Koaw({ request }, {
            debug: true
        });
        const router = new KoawRouter();
        const template_url = new URL(request.url);
        template_url.pathname = "/__template__.html"

        let template = await env.HtmlTpls.get("__template__.html")
        if (!template) {
            const template_request = await fetch(template_url.href);
            template = await template_request.text();
            env.HtmlTpls.put("__template__.html", template);
        }

        routes.forEach(route => {
            router.get(route.path, ctx => {
                try {
                    let edgeData = {}
                    const matchedRoutes = matchRoutes(routes, url.pathname);
                    if (matchedRoutes) {
                        // FIXME: should await data fetch
                        matchedRoutes.forEach(async item => {
                            if (item.route.component.getDataOnEdge && typeof item.route.component.getDataOnEdge === 'function') {
                                let data = await item.route.component.getDataOnEdge(url.href)
                                edgeData[item.route.path] = data;
                            }
                        })
                    }
                    console.log(edgeData)
                    const renderedHtml = renderToString(RenderToStringWrapper({ edgeData }));
                    ctx.res.body = template.replace("<!--ssr-outlet-->", renderedHtml.replace('\'{"edgeData": {}}\'', JSON.stringify(edgeData)));
                    ctx.res.status = 200;
                    ctx.res.headers["Content-Type"] = "text/html; charset=utf-8";
                } catch (e) {
                    console.log(e)
                    ctx.res.status = 500;
                    ctx.res.body = e.message;
                }
                return ctx.end();
            })
        })
        app.use(router.route());
        let response = await app.run().catch(e => { console.log(e) });
        if (response.status === 200) {
            return response;
        }
        return env.ASSETS.fetch(request);
    }
}
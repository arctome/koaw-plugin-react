import Koaw, { KoawRouter } from "koaw-js";
import { renderToString } from "react-dom/server.browser"
import { matchRoutes } from "react-router-dom"
import App from "./src/App.jsx"
import routes from "./src/routes"
import { StoreProvider } from "./preset/globalProvider.jsx"

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

        let edgeData = {}
        const matchedRoutes = matchRoutes(routes, url.pathname);
        const renderHandler = ctx => {
            const renderedHtml = renderToString(
                <StoreProvider store={edgeData}>
                    <StaticRouter location={url}>
                        <App />
                    </StaticRouter>
                </StoreProvider>
            );
            console.log(renderedHtml)
            ctx.res.body = template.replace("<!--ssr-outlet-->", renderedHtml.replace('\'{"edgeData": {}}\'', JSON.stringify(edgeData)));
            ctx.res.status = 200;
            ctx.res.headers["Content-Type"] = "text/html; charset=utf-8";
            ctx.end();
        }
        if (matchedRoutes) {
            matchedRoutes.forEach(async item => {
                if (item.route.component.getDataOnEdge && typeof item.route.component.getDataOnEdge === 'function') {
                    let data = await item.route.component.getDataOnEdge(url.href)
                    edgeData.ha = data;
                }
            })
        }
        // routes.forEach(item => {
        //     console.log(item.path)
            
        // })
        router.get("/about", renderHandler)
        app.use(router.route());
        let response = await app.run().catch(e => {console.log(e)});
        if(response.status === 200) {
            return response;
        } else {
            // console.log(matchedRoutes)
        }
        return env.ASSETS.fetch(request);
    }
}
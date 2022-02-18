import Koaw, { KoawRouter } from "koaw-js";

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const app = new Koaw({ request });
        const router = new KoawRouter();

        router.get('/example', ctx => {
            ctx.res.body = "hello pages";
            ctx.res.status = 200;
            ctx.end();
        })

        app.use(router.route());
        if (url.pathname.startsWith('/api/')) {
            let response = await app.run();
            return response || new Response("404 Not Found", { status: 404 });
        }
        return env.ASSETS.fetch(request);
    }
}
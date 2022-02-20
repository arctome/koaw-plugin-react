import * as Page1 from "./pages/page1.jsx"
import * as Page2 from "./pages/page2.jsx"

const routes = [
    {
        name: "Page1",
        component: Page1,
        path: "/"
    },
    {
        name: "Page2",
        component: Page2,
        path: "/about"
    }
]

export default routes;
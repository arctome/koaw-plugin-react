import * as Page1 from "./pages/page1.jsx"
import * as Page2 from "./pages/page2.jsx"
import * as Page3 from "./pages/page3.jsx"


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
    },
    {
        name: "Page3",
        component: Page3,
        path: "/no-ssr"
    }
]

export default routes;
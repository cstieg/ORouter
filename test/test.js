import { HashRouter } from "./HashRouter.js";

const router = new HashRouter({
    root: "app",
    loader: [],
    render: [
        renderTemplate
    ]
});
router.addRoutes([
    { name: "bar", html: "<h1>Hello for bar</h1><a href='#/foo/baz'>Baz</a>", defaultParameters: "a=1&b=2" },
    { name: "baz", html: "<h1>Hello for baz</h1><a href='#/foo/bar'>Bar</a>" },
], { namespace: "foo" });
router.init();


function renderTemplate(app, route) {
    const element = document.getElementById("app");
    element.innerHTML = route.html;
}
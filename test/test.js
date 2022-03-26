import { Router } from "./Router.js";

const router = new Router({
    root: "app"
});

router.addRoutes([
    { name: "bar", defaultParameters: "a=1&b=2", script: null },
    { name: "baz", loadedHtml: "<h1>Hello for baz</h1><a href='/foo/bar'>Bar</a>", script: null },
], { namespace: "foo" });
router.init();

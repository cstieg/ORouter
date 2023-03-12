import { ORouter } from "./ORouter.js";

const router = new ORouter({
    root: "app",
    routes: [
        { name: "bar", loadedHtml:"<h1>Root Bar</h1>" }
    ],
    onLoadError: [logErrors]
});

router.loader.push(ORouter.loaders.cssLoader);
router.renderer.push(ORouter.renderers.cssRenderer);

router.addRoutes([
    { name: "bar", defaultParameters: "a=1&b=2", css: true},
    { name: "baz", loadedHtml: "<h1>Hello for baz</h1><a href='/foo/bar'>Bar</a>" },
], {
    namespace: "foo",
    css: false,
    script: false
});
router.init();

function logErrors(e, app, route, loader) {
    console.log(e);
}
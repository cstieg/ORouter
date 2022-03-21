export default function onRenderedEvent(app, route) {
    if (route.importedScript && route.importedScript.onRendered) {
        if (typeof route.importedScript.onRendered !== "function") { throw "onRendered must be function"; }
        route.importedScript.onRendered(route, app);
    }
}
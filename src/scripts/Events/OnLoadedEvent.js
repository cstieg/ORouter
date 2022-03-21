export default function onLoadedEvent(app, route) {
    if (route.importedScript && route.importedScript.onLoaded) {
        if (typeof route.importedScript.onLoaded !== "function") { throw "onLoaded must be function"; }
        route.importedScript.onLoaded(route, app);
    }
}

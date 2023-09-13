export default function onRenderedEvent(app, route) {
    if (!route.importedScript) { return; }
    if (route.importedScript.onrendered) {
        route.importedScript.onRendered = route.importedScript.onrendered;
    }
    if (!route.importedScript.onRendered) { return; }
    if (typeof route.importedScript.onRendered !== "function") { throw "onRendered must be function"; }

    route.importedScript.onRendered(route, app);
}
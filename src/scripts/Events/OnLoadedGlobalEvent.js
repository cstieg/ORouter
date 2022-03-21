export default function onLoadedGlobalEvent(app, route) {
    if (app.onLoaded) {
        if (!Array.isArray(app.onLoaded)) { throw "onLoaded must be array"; }
        for (const doOnLoaded of app.onLoaded) {
            doOnLoaded(app, route);
        }
    }
}
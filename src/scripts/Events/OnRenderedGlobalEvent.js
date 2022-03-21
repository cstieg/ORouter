export default function onRenderedGlobalEvent(app, route) {
    if (app.onRendered) {
        if (!Array.isArray(app.onRendered)) { throw "onRendered must be array"; }
        for (const doOnRendered of app.onRendered) {
            doOnRendered(app, route);
        }
    }
}
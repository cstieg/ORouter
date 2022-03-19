export async function render(app, route) {
    const renderer = route.render || app.render;
    const renderers = Array.isArray(renderer) ? renderer
        : typeof renderer === "function" ? [renderer]
            : null;
    if (!renderers) { return Promise.resolve(); }

    try {
        for (const renderer of renderers) {
            renderer(app, route);
        }
    }
    catch (e) {
        const onRenderError = route.onRenderError || app.onRenderError;
        if (!Array.isArray(onRenderError)) { throw "Unable to render; onRenderError must be array"; }
        for (const doOnRenderError of onRenderError) {
            doOnRenderError(e, app, route);
        }
        throw "Unable to render";
    }

    onRenderedGlobalEvent(app, route);
    onRenderedEvent(app, route);

    return Promise.resolve();
}

function onRenderedGlobalEvent(app, route) {
    if (app.onRendered) {
        if (!Array.isArray(app.onRendered)) { throw "onRendered must be array"; }
        for (const doOnRendered of app.onRendered) {
            doOnRendered(app, route);
        }
    }
}

function onRenderedEvent(app, route) {
    if (route.importedScript && route.importedScript.onRendered) {
        if (typeof route.importedScript.onRendered !== "function") { throw "onRendered must be function"; }
        route.importedScript.onRendered(route, app);
    }
}
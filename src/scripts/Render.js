import coalesce from "./Helpers/Coalesce.js";
import onRenderedGlobalEvent from "./Events/OnRenderedGlobalEvent.js";
import onRenderedEvent from "./Events/OnRenderedEvent.js";

export default async function render(app, route) {
    const renderer = coalesce(route.renderer, app.renderer);
    const renderers = Array.isArray(renderer) ? renderer
        : typeof renderer === "function" ? [renderer]
            : null;
    if (!renderers) { return Promise.resolve(); }

    try {
        if (app.root) {
            app.root.setAttribute("data-currentrouteid", route.id);
        }
        for (const renderer of renderers) {
            renderer(app, route);
        }
    }
    catch (e) {
        const onRenderError = coalesce(route.onRenderError, app.onRenderError);
        if (!Array.isArray(onRenderError)) { throw "Unable to render; onRenderError must be array"; }
        for (const doOnRenderError of onRenderError) {
            doOnRenderError(e, app, route);
        }
        return Promise.reject();
    }

    onRenderedGlobalEvent(app, route);
    onRenderedEvent(app, route);

    return Promise.resolve();
}
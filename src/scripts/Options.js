import coalesce from "./Helpers/Coalesce.js";
import coalesceRecursive from "./Helpers/CoalesceRecursive.js";
import defaultOnLoadError from "./ErrorHandlers/DefaultOnLoadError.js";
import defaultOnRenderError from "./ErrorHandlers/DefaultOnRenderError.js";

export function setOptions(app, options) {
    Object.assign(app, options);

    setDefault(app, "baseUrl", globalThis.location.origin);

    // TODO: Allow setting routes on constructor
    setDefault(app, "routes", {});

    setDefault(app, "loader", [app.constructor.loaders?.htmlLoader]);
    setDefault(app, "scriptLoader", app.constructor.loaders?.scriptLoader);
    setDefault(app, "renderer", [app.constructor.renderers?.htmlRenderer]);

    setDefault(app, "path", {});
    setDefault(app, "defaultPath", "/static/*namespace*/*name*");

    // File extensions
    setDefault(app, "fileExtension", {});
    setDefault(app.fileExtension, "css", ".css");
    setDefault(app.fileExtension, "script", ".js");
    setDefault(app.fileExtension, "html", ".html");

    // Events
    setDefault(app, "onLoaded", []);
    setDefault(app, "onRendered", []);

    // Errors
    setDefault(app, "onLoadError", [defaultOnLoadError]);
    setDefault(app, "onRenderError", [defaultOnRenderError]);

    setRootElement(app);
}

function setDefault(obj, prop, defaultValue) {
    obj[prop] = coalesce(obj[prop], defaultValue);
}

export function setOptionsForRoutes(routes, options) {
    if (!routes || !Array.isArray(routes)) { throw "Must pass array of routes"; }
    if (typeof options !== "object") { return; }

    for (const route of routes) {
        coalesceRecursive(route, options);
    }
}

function setRootElement(app) {
    if (!app.root) {
        app.root = document.getElementById("app-root");
    }
    else if (typeof (app.root) === "string") {
        app.root = document.getElementById(app.root);
    }
    else if (!(app.root instanceof HTMLElement)) {
        throw "Option 'root' must either be HTMLElement or string id of HTML element";
    }
}

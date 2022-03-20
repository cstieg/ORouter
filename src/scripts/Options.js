import coalesce from "./Helpers/Coalesce.js";

export function setOptions(app, options) {
    Object.assign(app, options);

    setDefault(app, "baseUrl", window.location.origin);
    setDefault(app, "routes", {});
    setDefault(app, "loader", [app.constructor.loaders.templateLoader, app.constructor.loaders.dataLoader]);
    setDefault(app, "scriptLoader", app.constructor.loaders.scriptLoader);
    setDefault(app, "path", {});
    setDefault(app.path, "script", "./scripts");
    setDefault(app.path, "template", "./templates");
    setDefault(app.path, "data", "/");
    setDefault(app.path, "html", "./html");
    setDefault(app, "fileExtension", {});
    setDefault(app.fileExtension, "script", ".js");
    setDefault(app.fileExtension, "html", ".html");
    setDefault(app, "onLoaded", []);
    setDefault(app, "onLoadError", [defaultOnLoadError]);
    setDefault(app, "onRendered", []);
    setDefault(app, "onRenderError", []);

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

/**
 * Copies properties of dictionary objects from the source to the target recursively if they do not exist already in the target.
 */
function coalesceRecursive(target, source) {
    if (typeof source !== "object" || Array.isArray(source)) { throw "Source must be dictionary object"; }
    if (!target) { target = Object.assign({}, source); }
    if (typeof target !== "object" || Array.isArray(target)) { throw "Target must be dictionary object"; }
    for (const sourceKey of Object.keys(source)) {
        const sourceValue = source[sourceKey];
        if (sourceKey in target) {
            const targetValue = target[sourceKey];
            if (typeof sourceValue === "object" && !Array.isArray(sourceValue)
                && typeof (targetValue === "object" && !Array.isArray(targetValue))) {
                coalesceRecursive(targetValue, sourceValue);
            }
        }
        else if (typeof sourceValue === "object") {
            target[sourceKey] = Object.assign({}, sourceValue);
        }
        else {
            target[sourceKey] = sourceValue;
        }
    }
    return target;
}

function defaultOnLoadError(e) {
    throw "Error loading: " + e;
}
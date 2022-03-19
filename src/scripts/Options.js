import { loadScript } from "./ScriptLoader.js";

export function setOptions(app, options) {
    Object.assign(app, options);

    app.baseUrl = app.baseUrl ?? window.location.origin;
    app.routes = app.routes || {};
    app.loader = app.loader || [HashRouter.templateLoader, HashRouter.dataLoader];
    app.scriptLoader = app.scriptLoader || loadScript;
    app.path = app.path || {};
    app.path.script = app.path?.script || "./scripts";
    app.path.template = app.path?.template || "./templates";
    app.path.data = options.path?.data || "/";
    app.fileExtension = options.fileExtension || {};
    app.fileExtension.script = app.fileExtension.script || ".js";
    app.onLoaded = options.onLoaded || [];
    app.onLoadError = options.onLoadError || [defaultOnLoadError];

    setRootElement(app);
}

export function setOptionsForRoutes(routes, options) {
    if (!routes || !Array.isArray(routes)) { throw "Must pass array of routes"; }
    if (typeof options !== "object") { return; }

    for (const route of routes) {
        coalesceRecursive(route, options);
    }
}

function setRootElement(app) {
    if (app.root === undefined) {
        app.root = document.getElementById("app-root");
    }
    else if (typeof (app.root) === "string") {
        app.root = document.getElementById(app.root);
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
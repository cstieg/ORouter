function coalesce(value1, value2) {
    if (value1 !== undefined) { return value1; }
    return value2;
}

/**
 * Copies properties of dictionary objects from the source to the target recursively if they do not exist already in the target.
 * @param {any} target
 * @param {any} source
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

function defaultOnRenderError(e) {
    throw "Error rendering: " + e;
}

function setOptions(app, options) {
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

function setOptionsForRoutes(routes, options) {
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

const pathSlashRegex = new RegExp("(?<!:|:/)/", "g"); // Matches all forward slashes except after : as in http://

function joinPath() {
    if (arguments.length === 0) { throw "Must pass arguments to joinPath"; }
    for (const argument in arguments) {
        if (typeof argument !== "string") { throw "Arguments must be strings" }    }
    const argumentArray = [...arguments];
    const startsWithSlash = arguments[0].startsWith("/");
    return (startsWithSlash ? "/" : "")
        + argumentArray
        .join("/")
        .split(pathSlashRegex)
        .filter(el => el)
        .join("/")
        .toLowerCase();
}

function addRoutes(routes, options) {
    const app = this;

    setOptionsForRoutes(routes, options);

    for (const route of routes) {
        if (!route.name) { throw "Must define route name"; }

        const namespacedRouteName = "/" + joinPath(route.namespace, route.name);
        const existingRoute = routes[namespacedRouteName];
        if (existingRoute) { throw "Route must be unique: " + namespacedRouteName; }

        route.id = namespacedRouteName;
        app.routes[namespacedRouteName] = route;
    }

    return app;
}

function onLoadedGlobalEvent(app, route) {
    if (app.onLoaded) {
        if (!Array.isArray(app.onLoaded)) { throw "onLoaded must be array"; }
        for (const doOnLoaded of app.onLoaded) {
            doOnLoaded(app, route);
        }
    }
}

function onLoadedEvent(app, route) {
    if (route.importedScript && route.importedScript.onLoaded) {
        if (typeof route.importedScript.onLoaded !== "function") { throw "onLoaded must be function"; }
        route.importedScript.onLoaded(route, app);
    }
}

/**
 * Splits an array of objects into array of arrays.  When a specified property of the object is different from the previous, a new group is started.
 * @param {any} arr     The array of objects
 * @param {any} prop    The specified property of the object to group on
 */
function groupByChange(arr, prop) {
    const groups = [];
    if (!arr.length) { return groups; }
    let currentGroup = [];
    let previousProp = arr[0][prop];
    for (const item of arr) {
        const currentProp = item[prop];

        if (currentProp !== previousProp) {
            groups.push(currentGroup);
            currentGroup = [];
            previousProp = currentProp;
        }

        currentGroup.push(item);
    }
    groups.push(currentGroup);
    return groups;
}

async function load(app, route) {
    const loader = coalesce(route.loader, app.loader);
    const loaders = Array.isArray(loader) ? loader
        : typeof loader === "function" ? [loader]
            : null;
    if (!loaders || !loaders.length) { return Promise.resolve(); }

    try {
        await loadGroups(app, route, loaders);
    }
    catch (e) {
        const onLoadError = coalesce(route.onLoadError, app.onLoadError);
        if (!Array.isArray(onLoadError)) { throw "Unable to load; onLoadError must be array"; }
        for (const doOnLoadError of onLoadError) {
            doOnLoadError(e, app, route);
        }
        return Promise.reject();
    }

    onLoadedGlobalEvent(app, route);
    onLoadedEvent(app, route);
    return Promise.resolve();
}

async function loadGroups(app, route, loaders) {
    for (const loader of loaders) {
        loader.IsBlocking = loader.IsBlocking ?? false;
    }
    const groups = groupByChange(loaders, "IsBlocking");
    for (const group of groups) {
        if (group[0].IsBlocking) {
            await loadBlocking(group, app, route);
        }
        else {
            await loadParallel(group, app, route);
        }
    }
    return Promise.resolve();
}

function loadBlocking(loaders, app, route) {
    if (!loaders || !loaders.length) { return Promise.resolve(); }
    let chainedPromise = Promise.resolve();
    for (const loader of loaders) {
        chainedPromise = chainedPromise.then(() => loader(app, route));
    }
    return chainedPromise;
}

function loadParallel(loaders, app, route) {
    const loadPromises = loaders.map(loader => loader(app, route));
    return Promise.all(loadPromises);
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

async function render(app, route) {
    const renderer = coalesce(route.renderer, app.renderer);
    const renderers = Array.isArray(renderer) ? renderer
        : typeof renderer === "function" ? [renderer]
            : null;
    if (!renderers) { return Promise.resolve(); }

    try {
        if (app.root) {
            app.root.setAttribute("data-currentRouteId", route.id);
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

function beforeLoadEvent(app, route) {
    if (route.importedScript && route.importedScript.beforeLoad) {
        const beforeLoadResult = route.importedScript.beforeLoad(route, app);
        // Undefined result should return true
        return beforeLoadResult !== false;
    }

    return true;
}

function init() {
    const app = this;
    window.onhashchange = navigate;
    window.onpopstate = navigate;
    document.addEventListener("click", function (e) {
        if (e.target.tagName.toLowerCase() !== "a") { return; }
        navigateToHref(e);
    });
    navigate();
    return app;

    async function navigate() {
        await navigateToUrl(app, location.href);
    }

    async function navigateToHref(e) {
        history.pushState({}, null, e.target.href);
        e.preventDefault();
        navigateToUrl(app, e.target.href);
    }
}

async function navigateToUrl(app, url) {
    if (!app) { throw "Must pass app"; }
    if (typeof url !== "string") { throw "Url must be string"; }

    if (!url.toLowerCase().startsWith(app.baseUrl.toLowerCase())) {
        console.log("Leaving site");
        return;
    }

    const routeDifference = url.slice(app.baseUrl.length);
    const indexOfQuery = routeDifference.indexOf("?");
    const sliceEnd = indexOfQuery === -1 ? routeDifference.length : indexOfQuery;
    const routeName = routeDifference.slice(0, sliceEnd);

    const route = app.routes[routeName];
    if (!route) { throw "Cannot find route " + routeName; }

    const searchParams = indexOfQuery === -1 ? new URLSearchParams()
        : new URLSearchParams(routeDifference.substring(indexOfQuery));
    setParameters(route, searchParams);
    await navigateToRoute(app, route);
}

async function navigateToRoute(app, route) {
    const scriptLoader = coalesce(route.scriptLoader, app.scriptLoader);
    if (typeof scriptLoader === "function") {
        await scriptLoader(app, route);
    }

    if (!beforeLoadEvent(app, route)) { return; }

    await load(app, route);
    await render(app, route);
}

function setParameters(route, searchParams) {
    route.parameters = searchParams;
    if (!route.defaultParameters) { return; }

    const specifiedParameterKeySet = new Set(searchParams.keys());
    const defaultSearchParams = new URLSearchParams(route.defaultParameters);
    for (const defaultSearchParam of defaultSearchParams.entries()) {
        if (specifiedParameterKeySet.has(defaultSearchParam[0])) { continue; }
        searchParams.append(defaultSearchParam[0], defaultSearchParam[1]);
    }
}

function htmlRenderer(app, route) {
    if (!route.loadedHtml) { return; }
    app.root.innerHTML = route.loadedHtml;
}

function populateRenderers(HashRouter) {
    HashRouter.renderers = {
        cssRenderer,
        htmlRenderer
    };
}

function getFileName(app, route, fileType) {
    let fileName = getFileNameBase(route, fileType);
    if (!fileName) { return null; }

    const fileExtension = getFileExtension(app, route, fileType);
    if (fileExtension && !fileName.endsWith(fileExtension)) {
        fileName += fileExtension;
    }
    return fileName;
}

function getFileNameBase(route, fileType) {
    const routeFileName = route[fileType];

    if (routeFileName === "" || routeFileName === null) { return null; }

    const fileName = routeFileName || route.name;
    return fileName;
}

function getFileExtension(app, route, fileType) {
    const routeFileExtension = route.fileExtension && route.fileExtension[fileType];
    const appFileExtension = app.fileExtension[fileType];
    const fileExtension = routeFileExtension || appFileExtension;
    return fileExtension;
}

function getUrl(app, route, fileType, fileName) {
    if (!fileName) { return null; }

    // Absolute paths or relative paths starting from . or .. do not need to add path
    if (fileName.includes("//") || fileName.startsWith(".")) {
        return fileName;
    }

    const appPath = getAppPath(app, fileType);

    const replacedAppPath = replaceVariables(appPath, route.namespace, fileName);
    return joinPath(replacedAppPath);
}

function replaceVariables(appPath, namespace, fileName) {
    return appPath
        .toLowerCase()
        .replace("*namespace*", namespace)
        .replace("*name*", fileName);
}

function getAppPath(app, fileType) {
    return app.path[fileType]
        ?? app.defaultPath;
}

cssLoader.IsBlocking = false;

function cssLoader(app, route) {
    return new Promise((resolve, reject) => {
        if (route.loadedCss !== undefined) { resolve(); }

        const cssName = getFileName(app, route, "css");
        if (!cssName) {
            resolve();
            return;
        }

        const url = getUrl(app, route, "css", cssName);

        fetch(url)
            .then(async function (response) {
                if (response.ok) {
                    route.loadedCss = await response.text();
                    resolve();
                }
                else {
                    route.loadedCss = null;
                    reject();
                }
            });
    });
}

dataLoader.IsBlocking = false;

function dataLoader(app, route) {
    return new Promise((resolve, reject) => {
        if (route.loadedData !== undefined) { resolve(); }

        const dataName = getFileName(app, route, "data");
        if (!dataName) {
            resolve();
            return;
        }

        const urlString = getUrl(app, route, "data", dataName);
        const url = new URL(urlString);
        if (route.parameters) {
            url.search = route.parameters;
        }

        fetch(url.toString()).then(async function (response) {
            if (response.ok) {
                route.loadedData = await response.json();
                resolve();
            }
            else {
                reject();
            }
        });
    });
}

htmlLoader.IsBlocking = false;

function htmlLoader(app, route) {
    return new Promise((resolve, reject) => {
        if (route.loadedHtml !== undefined) { resolve(); }

        const htmlName = getFileName(app, route, "html");
        if (!htmlName) {
            resolve();
            return;
        }

        const url = getUrl(app, route, "html", htmlName);

        fetch(url)
            .then(async function (response) {
                if (response.ok) {
                    route.loadedHtml = await response.text();
                    resolve();
                }
                else {
                    route.loadedHtml = null;
                    reject();
                }
            });
    });
}

templateLoader.IsBlocking = false;

function templateLoader(app, route) {
    return new Promise((resolve, reject) => {
        if (route.loadedTemplate !== undefined) { resolve(); }

        const templateName = getFileName(app, route, "template");
        if (!templateName) {
            resolve();
            return;
        }

        const url = getUrl(app, route, "template", templateName);

        fetch(url)
            .then(async function (response) {
                if (response.ok) {
                    route.loadedTemplate = await response.text();
                    resolve();
                }
                else {
                    route.loadedTemplate = null;
                    reject();
                }
            });
    });
}

async function scriptLoader(app, route) {
    if (route.script === "" || route.script === null) { return; }
    if (route.importedScript) { return; }

    const scriptName = getFileName(app, route, "script");
    const scriptUrl = getUrl(app, route, "script", scriptName);
    if (!scriptUrl) { return; }

    return new Promise((resolve, reject) => {
        import(scriptUrl)
            .then(scr => {
                route.importedScript = scr;
                resolve();
            })
            .catch(function (err) {
                route.importedScript = null;
                resolve();
            });
    });
}

function populateLoaders(HashRouter) {
    HashRouter.loaders = {
        cssLoader,
        dataLoader,
        htmlLoader,
        templateLoader,

        scriptLoader
    };
}

/**
 * Router constructor
 * @constructor
 * @param {object} [options]  Options object
 */
function Router(options) {
    const app = this;
    setOptions(app, options);
    app.addRoutes = addRoutes.bind(app);
    app.init = init.bind(app);
}

populateLoaders(Router);
populateRenderers(Router);

export { Router };

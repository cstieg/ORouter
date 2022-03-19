export function init() {
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
    const scriptLoader = route.scriptLoader || app.scriptLoader;
    await scriptLoader(app, route);

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

function updateHash(hashUrl) {
    const updatedHash = hashUrl.pathname + hashUrl.search;
    replaceHash(updatedHash);
}

function replaceHash(hash) {
    const newUrl = new URL(window.location);
    newUrl.hash = hash;
    history.replaceState(null, null, newUrl.toString());
}

function beforeLoadEvent(app, route) {
    if (route.importedScript && route.importedScript.beforeLoad) {
        const beforeLoadResult = route.importedScript.beforeLoad(route, app);
        // Undefined result should return true
        return beforeLoadResult !== false;
    }

    return true;
}

async function load(app, route) {
    const loader = route.loader || app.loader;
    const loaders = Array.isArray(loader) ? loader
        : typeof loader === "function" ? [loader]
            : null;
    if (!loaders) { return Promise.resolve(); }

    try {
        await loadGroups(app, route, loaders);
    }
    catch(e) {
        const onLoadError = route.onLoadError || app.onLoadError;
        if (!Array.isArray(onLoadError)) { throw "Unable to load; onLoadError must be array"; }
        for (const doOnLoadError of onLoadError) {
            doOnLoadError(e, app, route);
        }
        throw "Unable to load";
    }

    onLoadedGlobalEvent(app, route);
    onLoadedEvent(app, route);
    return Promise.resolve();
}

async function loadGroups(app, route, loaders) {
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



function loadBlocking(group, app, route) {
    if (!group || !group.length) { return Promise.resolve(); }
    let chainedPromise = group[0];
    for (let i = 1; i < group.length; i++) {
        const loader = group[i];
        chainedPromise = chainedPromise.then(() => loader(app, route));
    }
    return chainedPromise;
}

function loadParallel(group, app, route) {
    const loadPromises = group.map(loader => loader(app, route));
    return Promise.all(loadPromises);
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

async function render(app, route) {
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
    catch(e) {
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
export function beforeLoadEvent(app, route) {
    if (route.importedScript && route.importedScript.beforeLoad) {
        const beforeLoadResult = route.importedScript.beforeLoad(route, app);
        // Undefined result should return true
        return beforeLoadResult !== false;
    }

    return true;
}

export async function load(app, route) {
    const loader = route.loader || app.loader;
    const loaders = Array.isArray(loader) ? loader
        : typeof loader === "function" ? [loader]
            : null;
    if (!loaders || !loaders.length) { return Promise.resolve(); }

    try {
        await loadGroups(app, route, loaders);
    }
    catch (e) {
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

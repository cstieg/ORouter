import onLoadedGlobalEvent from "./Events/OnLoadedGlobalEvent.js";
import onLoadedEvent from "./Events/OnLoadedEvent.js";
import coalesce from "./Helpers/Coalesce.js";
import groupByChange from "./Helpers/GroupByChange.js";

export default async function load(app, route) {
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

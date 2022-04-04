import onLoadedGlobalEvent from "./Events/OnLoadedGlobalEvent.js";
import onLoadedEvent from "./Events/OnLoadedEvent.js";
import catchLoaderError from "./ErrorHandlers/CatchLoaderError.js";
import coalesce from "./Helpers/Coalesce.js";
import groupByChange from "./Helpers/GroupByChange.js";

export default async function load(app, route) {
    const loader = coalesce(route.loader, app.loader);
    const loaders = Array.isArray(loader) ? loader
        : typeof loader === "function" ? [loader]
            : null;
    if (!loaders || !loaders.length) { return Promise.resolve(); }

    await loadGroups(app, route, loaders);

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
        chainedPromise = chainedPromise.then(() => loadSingle(loader, app, route));
    }
    return chainedPromise;
}

function loadParallel(loaders, app, route) {
    const loadPromises = loaders.map(loader => loadSingle(loader, app, route));
    return Promise.all(loadPromises);
}

function loadSingle(loader, app, route) {
    return loader(app, route)
        .catch(e => catchLoaderError(e, app, route, loader));
}

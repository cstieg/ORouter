import { beforeLoadEvent, load } from "./Load.js";
import { render } from "./Render.js";
import coalesce from "./Helpers/Coalesce.js";

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
import coalesce from "../Helpers/Coalesce.js";

export default function catchLoaderError(e, app, route, loader) {
    const onLoadError = coalesce(route.onLoadError, app.onLoadError);
    if (!Array.isArray(onLoadError)) { throw "Unable to load; onLoadError must be array"; }

    for (const doOnLoadError of onLoadError) {
        doOnLoadError(e, app, route, loader);
    }
}
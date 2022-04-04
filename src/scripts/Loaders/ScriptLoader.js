import catchLoaderError from "../ErrorHandlers/CatchLoaderError.js";
import getFileName from "../GetFileName.js";
import getUrl from "../GetUrl.js";

export default async function scriptLoader(app, route) {
    if (route.script === "" || route.script === null) { return; }
    if (route.importedScript) { return; }

    const scriptName = getFileName(app, route, "script");
    const url = getUrl(app, route, "script", scriptName);
    if (!url) { return; }

    return new Promise((resolve, reject) => {
        import(url)
            .then(scr => {
                route.importedScript = scr;
                resolve();
            })
            .catch(function (err) {
                route.importedScript = null;
                catchLoaderError(err, app, route, scriptLoader);
                resolve();
            });
    });
}
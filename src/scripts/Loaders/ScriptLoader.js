import { getFileName, getUrl } from "../FileName.js";

export default async function scriptLoader(app, route) {
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

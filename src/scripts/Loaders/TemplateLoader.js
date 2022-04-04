import getFileName from "../GetFileName.js";
import getUrl from "../GetUrl.js";

templateLoader.IsBlocking = false;

export default function templateLoader(app, route) {
    return new Promise((resolve, reject) => {
        if (route.loadedTemplate !== undefined) {
            resolve();
            return;
        }

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
                    reject(`Template ${url} not found`);
                }
            });
    });
}

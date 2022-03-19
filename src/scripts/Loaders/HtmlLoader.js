import { getFileName, getUrl } from "../FileName.js";

htmlLoader.IsBlocking = false;

export default function htmlLoader(app, route) {
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

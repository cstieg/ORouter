import getFileName from "../GetFileName.js";
import getUrl from "../GetUrl.js";

cssLoader.IsBlocking = false;

export default function cssLoader(app, route) {
    return new Promise((resolve, reject) => {
        if (route.loadedCss !== undefined) {
            resolve();
            return;
        }

        const cssName = getFileName(app, route, "css");
        if (!cssName) {
            resolve();
            return;
        }

        const url = getUrl(app, route, "css", cssName);

        fetch(url)
            .then(async function (response) {
                if (response.ok) {
                    route.loadedCss = await response.text();
                    resolve();
                }
                else {
                    fail();
                }
            }).catch(fail);


        function fail() {
            route.loadedCss = null;
            reject(`Script ${url} not found`);
        }
    });
}

import { getFileName, getUrl } from "../FileName.js";

dataLoader.IsBlocking = false;

export default function dataLoader(app, route) {
    return new Promise((resolve, reject) => {
        if (route.loadedData !== undefined) { resolve(); }

        const dataName = getFileName(app, route, "data");
        if (!dataName) {
            resolve();
            return;
        }

        const url = new URL(getUrl(app, route, "data", dataName));
        url.search = route.parameters;

        fetch(url).then(async function (response) {
            if (response.ok) {
                route.loadedData = await response.json();
                resolve();
            }
            else {
                reject();
            }
        });
    });
}

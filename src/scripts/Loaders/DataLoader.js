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

        const urlString = getUrl(app, route, "data", dataName);
        const url = new URL(urlString);
        if (route.parameters) {
            url.search = route.parameters;
        }

        fetch(url.toString()).then(async function (response) {
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

import { getFileName, getUrl } from "./FileName.js";

templateLoader.IsBlocking = false;
dataLoader.IsBlocking = false;

export function templateLoader(app, route) {
    return new Promise((resolve, reject) => {
        if (route.loadedTemplate !== undefined) { resolve(); }

        const templateName = getFileName(app, route, "template");
        if (!templateName) {
            resolve();
            return;
        }

        const templateUrl = getUrl(app, route, "template", templateName);

        fetch(templateUrl)
            .then(async function (response) {
                if (response.ok) {
                    route.loadedTemplate = await response.text();
                    resolve();
                }
                else {
                    route.loadedTemplate = null;
                    reject();
                }
            });
    });
}

export function dataLoader(app, route) {
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



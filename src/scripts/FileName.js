const pathSlashRegex = new RegExp("(?<!:|:/)/", "g"); // Matches all forward slashes except after : as in http://

export function getFileName(app, route, fileType) {
    const routeFileName = route[fileType];

    if (routeFileName === "" || routeFileName === null) { return null; }

    let fileName = routeFileName || route.name;
    const routeFileExtension = route.fileExtension && route.fileExtension[fileType];
    const appFileExtension = app.fileExtension[fileType];
    const fileExtension = routeFileExtension || appFileExtension;

    if (fileExtension && !fileName.endsWith(fileExtension)) {
        fileName += fileExtension;
    }
    return fileName;
}

export function getUrl(app, route, fileType, fileName) {
    if (!fileName) { return null; }

    // Absolute paths or relative paths starting from . or .. do not need to add path
    const appPath = (fileName.includes("//") || fileName.startsWith("."))
        ? ""
        : getAppPath(app, fileType);

    // Relative paths starting with / do not need to be namespaced
    const namespace = fileName.startsWith("/")
        ? ""
        : route.namespace;

    return joinPath(appPath, namespace, fileName);
}

export function joinPath() {
    for (const argument in arguments) {
        if (typeof argument !== "string") { throw "Arguments must be strings" }; 
    }
    const argumentArray = [...arguments];
    return argumentArray
        .join("/")
        .split(pathSlashRegex)
        .filter(el => el)
        .join("/")
        .toLowerCase();
}

function getAppPath(app, fileType) {
    let appPath = app.path[fileType];
    if (!appPath) { throw "Must set app.path." + fileType + " in order to use relative path"; }
    return appPath;
}
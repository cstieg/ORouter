import joinPath from "./Helpers/JoinPath.js";

export default function getUrl(app, route, fileType, fileName) {
    if (!fileName) { return null; }

    // Absolute paths or relative paths starting from . or .. do not need to add path
    if (fileName.includes("//") || fileName.startsWith(".")) {
        return fileName;
    }

    const appPath = getAppPath(app, fileType);

    const replacedAppPath = replaceVariables(appPath, route.namespace, fileName);
    return joinPath(replacedAppPath);
}

function replaceVariables(appPath, namespace, fileName) {
    return appPath
        .toLowerCase()
        .replace("*namespace*", namespace)
        .replace("*name*", fileName);
}

function getAppPath(app, fileType) {
    return app.path[fileType]
        ?? app.defaultPath;
}
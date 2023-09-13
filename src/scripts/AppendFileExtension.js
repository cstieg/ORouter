export default function appendFileExtension(app, route, fileType, path) {
    if (!path) { return null; }

    const fileExtension = getFileExtension(app, route, fileType);
    if (fileExtension && !path.endsWith(fileExtension)) {
        path += fileExtension;
    }
    return path;
}

function getFileExtension(app, route, fileType) {
    const routeFileExtension = route.fileExtension && route.fileExtension[fileType];
    const appFileExtension = app.fileExtension[fileType];
    const fileExtension = routeFileExtension || appFileExtension;
    return fileExtension;
}
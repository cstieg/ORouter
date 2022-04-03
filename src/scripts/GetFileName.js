export default function getFileName(app, route, fileType) {
    let fileName = getFileNameBase(route, fileType);
    if (!fileName) { return null; }

    const fileExtension = getFileExtension(app, route, fileType);
    if (fileExtension && !fileName.endsWith(fileExtension)) {
        fileName += fileExtension;
    }
    return fileName;
}

function getFileNameBase(route, fileType) {
    const routeFileName = route[fileType];

    if (routeFileName === "" || routeFileName === null) { return null; }

    const fileName = routeFileName || route.name;
    return fileName;
}

function getFileExtension(app, route, fileType) {
    const routeFileExtension = route.fileExtension && route.fileExtension[fileType];
    const appFileExtension = app.fileExtension[fileType];
    const fileExtension = routeFileExtension || appFileExtension;
    return fileExtension;
}
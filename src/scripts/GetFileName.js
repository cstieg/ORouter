export default function getFileName(app, route, fileType) {
    const routeFileName = route[fileType];

    if (routeFileName === "" || routeFileName === null || routeFileName === false) { return null; }
    if (routeFileName === true) { return route.name; }

    const fileName = routeFileName || route.name;
    return fileName;
}

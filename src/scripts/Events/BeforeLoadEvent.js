export default function beforeLoadEvent(app, route) {
    if (route.importedScript && route.importedScript.beforeLoad) {
        const beforeLoadResult = route.importedScript.beforeLoad(route, app);
        // Undefined result should return true
        return beforeLoadResult !== false;
    }

    return true;
}
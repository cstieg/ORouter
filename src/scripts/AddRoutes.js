import { setOptionsForRoutes } from "./Options.js";
import { joinPath } from "./FileName.js";

export function addRoutes(routes, options) {
    const app = this;

    setOptionsForRoutes(routes, options);

    for (const route of routes) {
        if (!route.name) { throw "Must define route name"; }

        const namespacedRouteName = "/" + joinPath(route.namespace, route.name);
        const existingRoute = routes[namespacedRouteName];
        if (existingRoute) { throw "Route must be unique: " + namespacedRouteName; }

        app.routes[namespacedRouteName] = route;
    }

    return app;
};

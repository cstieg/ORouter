import { setOptionsForRoutes } from "./Options.js";
import joinPath from "./Helpers/JoinPath.js";

export default function addRoutes(routes, options) {
    const app = this;

    setOptionsForRoutes(routes, options);

    for (const route of routes) {
        if (!route.name) { throw "Must define route name"; }

        const appNameSpace = route.name.startsWith("/") ? "" : app.namespace;
        const namespacedRouteName = joinPath("/", appNameSpace, route.namespace, route.name);
        const existingRoute = routes[namespacedRouteName];
        if (existingRoute) { throw "Route must be unique: " + namespacedRouteName; }

        route.id = namespacedRouteName;
        app.routes[namespacedRouteName] = route;
    }

    return app;
};

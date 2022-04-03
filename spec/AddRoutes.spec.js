import addRoutes from "../src/scripts/AddRoutes.js";

describe("addRoutes", () => {
    it("adds routes to app with options", () => {
        const app = {
            routes: {},
            addRoutes: addRoutes
        };
        const routes = [{
            name: "bar"
        },
        {
            name: "baz"
        }];
        const options = {
            namespace: "foo"
        };
        const expectedAppRoutes = {
            "/foo/bar": {
                name: "bar",
                namespace: "foo"
            },
            "/foo/baz": {
                name: "baz",
                namespace: "foo"
            }
        };
        app.addRoutes(routes, options);
        expect(app.routes).toEqual(expectedAppRoutes);
    });
});
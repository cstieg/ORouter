import load from "../src/scripts/Load.js";

describe("load", () => {
    it("calls the loader for the app", async () => {
        const loader = function (app, route) { };
        const app = {
            loader: loader
        };
        const route = {};

        spyOn(app, "loader");
        await load(app, route);
        expect(app.loader).toHaveBeenCalledWith(app, route);
    });

    it("calls the loader for the route", async () => {
        const loader = function (app, route) { };
        const app = {
            loader: (app, route) => { }
        };
        const route = {
            loader: loader
        };

        spyOn(route, "loader");
        await load(app, route);
        expect(route.loader).toHaveBeenCalledWith(app, route);
    });

    it("calls multiple loaders", async () => {
        const loaders = {
            loader1: function (app, route) { },
            loader2: function (app, route) { }
        };

        const app = {
            loader: [
                (app, route) => loaders.loader1(app, route),
                (app, route) => loaders.loader2(app, route)
            ]
        };
        const route = {};

        spyOn(loaders, "loader1");
        spyOn(loaders, "loader2");

        await load(app, route);
        expect(loaders.loader1).toHaveBeenCalledWith(app, route);
        expect(loaders.loader2).toHaveBeenCalledWith(app, route);
    });

    it("calls multiple loaders in order", async () => {
        let x = "";
        let called = false;
        const loaders = {
            loader1: function (app, route) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        x = "called";
                        resolve();
                    }, 1);
                });
            },
            loader2: function (app, route) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        called = x === "called";
                        resolve();
                    }, 1);
                });
            }
        };

        loaders.loader1.IsBlocking = true;
        loaders.loader2.IsBlocking = true;

        const app = {
            loader: [loaders.loader1, loaders.loader2],
            onLoadError: [function (err) {
                console.log(err);
            }]
        };
        const route = {};

        await load(app, route);
        expect(called).toBe(true);
    });
});
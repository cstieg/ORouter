import render from "../src/scripts/Render.js";

describe("render", () => {
    it("calls the renderer for the app", async () => {
        const renderer = function (app, route) { };
        const app = {
            renderer: renderer
        };
        const route = {};

        spyOn(app, "renderer");
        await render(app, route);
        expect(app.renderer).toHaveBeenCalledWith(app, route);
    });

    it("calls the renderer for the route", async () => {
        const renderer = function (app, route) { };
        const app = {
            renderer: (app, route) => { }
        };
        const route = {
            renderer: renderer
        };

        spyOn(route, "renderer");
        await render(app, route);
        expect(route.renderer).toHaveBeenCalledWith(app, route);
    });

    it("calls multiple renderers", async () => {
        const renderers = {
            renderer1: function (app, route) { },
            renderer2: function (app, route) { }
        };

        const app = {
            renderer: [
                (app, route) => renderers.renderer1(app, route),
                (app, route) => renderers.renderer2(app, route)
            ]
        };
        const route = {};

        spyOn(renderers, "renderer1");
        spyOn(renderers, "renderer2");

        await render(app, route);
        expect(renderers.renderer1).toHaveBeenCalledWith(app, route);
        expect(renderers.renderer2).toHaveBeenCalledWith(app, route);
    });
});
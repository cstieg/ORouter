import { setOptions, setOptionsForRoutes } from "../src/scripts/Options.js";

describe("setOptions", () => {
    it("sets the properties of the app from the options", async () => {
        const app = {};
        const options = {
            baseUrl: "https://www.example.com",
            loader: null,
            scriptLoader: null,
            renderer: null
        };

        // Shims
        class HTMLElement { }
        globalThis.document = {
            getElementById: () => new HTMLElement()
        };
        globalThis.location = {
            origin: ""
        };

        setOptions(app, options);

        expect(app.baseUrl).toEqual(options.baseUrl);
    });

    it("sets the root element", async () => {
        const app = {};
        const options = {
            baseUrl: "https://www.example.com",
            loader: null,
            scriptLoader: null,
            renderer: null
        };

        // Shims
        class HTMLElement { }
        const htmlElement = new HTMLElement();
        globalThis.document = {
            getElementById: () => htmlElement
        };
        globalThis.location = {
            origin: ""
        };

        setOptions(app, options);

        expect(app.root).toEqual(htmlElement);
    });
});

describe("setOptionsForRoutes", () => {
    it("sets the properties of the routes from the options", async () => {
        const routes = [
            { name: "route2" },
            { name: "route3" }
        ];
        const options = {
            namespace: "foo"
        };

        setOptionsForRoutes(routes, options);

        for (const route of routes) {
            expect(route.namespace).toEqual("foo");
        }
    });
});
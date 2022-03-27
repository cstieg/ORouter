import templateLoader from "../../src/scripts/Loaders/TemplateLoader.js";
import setGlobalFetch from "../support/setGlobalFetch.js";

describe("templateLoader", () => {
    it("loads a template from the specified path", async () => {
        setGlobalFetch();
        spyOn(globalThis, "fetch").and.callThrough();

        const app = getApp();
        const route = getRoute();
        await templateLoader(app, route);
        expect(globalThis.fetch).toHaveBeenCalledWith("https://www.example.com/static/bar.hbs");
    });

    it("assigns the template to loadedTemplate", async () => {
        setGlobalFetch();
        spyOn(globalThis, "fetch").and.callThrough();

        const app = getApp();
        const route = getRoute();
        await templateLoader(app, route);
        expect(route.loadedTemplate).toEqual("");
    });
});

function getApp() {
    return {
        path: {
            template: "https://www.example.com/static/*name*"
        },
        fileExtension: {
            template: ".hbs"
        }
    };
}

function getRoute() {
    return {
        name: "bar"
    };
}
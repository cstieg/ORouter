import cssLoader from "../../src/scripts/Loaders/CssLoader.js";
import setGlobalFetch from "../support/setGlobalFetch.js";

describe("cssLoader", () => {
    it("loads a CSS style from the specified path", async () => {
        setGlobalFetch();
        spyOn(globalThis, "fetch").and.callThrough();

        const app = getApp();
        const route = getRoute();
        await cssLoader(app, route);
        expect(globalThis.fetch).toHaveBeenCalledWith("https://www.example.com/static/bar.css");
    });

    it("assigns the CSS style to loadedCss", async () => {
        setGlobalFetch();
        spyOn(globalThis, "fetch").and.callThrough();

        const app = getApp();
        const route = getRoute();
        await cssLoader(app, route);
        expect(route.loadedCss).toEqual("");
    });
});

function getApp() {
    return {
        path: {
            css: "https://www.example.com/static/*name*"
        },
        fileExtension: {
            css: ".css"
        }
    };
}

function getRoute() {
    return {
        name: "bar"
    };
}
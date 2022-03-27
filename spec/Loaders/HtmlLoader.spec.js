import htmlLoader from "../../src/scripts/Loaders/HtmlLoader.js";
import setGlobalFetch from "../support/setGlobalFetch.js";

describe("htmlLoader", () => {
    it("loads html from the specified path", async () => {
        setGlobalFetch();
        spyOn(globalThis, "fetch").and.callThrough();

        const app = getApp();
        const route = getRoute();
        await htmlLoader(app, route);
        expect(globalThis.fetch).toHaveBeenCalledWith("https://www.example.com/static/bar.html");
    });

    it("assigns the data to loadedHtml", async () => {
        setGlobalFetch();
        spyOn(globalThis, "fetch").and.callThrough();

        const app = getApp();
        const route = getRoute();
        await htmlLoader(app, route);
        expect(route.loadedHtml).toEqual("");
    });
});

function getApp() {
    return {
        path: {
            html: "https://www.example.com/static/*name*"
        },
        fileExtension: {
            html: ".html"
        }
    };
}

function getRoute() {
    return {
        name: "bar"
    };
}
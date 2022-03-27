import dataLoader from "../../src/scripts/Loaders/DataLoader.js";
import setGlobalFetch from "../support/setGlobalFetch.js";

describe("DataLoader", () => {
    it("loads data from the specified path", async () => {
        setGlobalFetch();
        spyOn(globalThis, "fetch").and.callThrough();

        const app = getApp();
        const route = getRoute();
        await dataLoader(app, route);
        expect(globalThis.fetch).toHaveBeenCalledWith("https://www.example.com/api/foo/bar");
    });

    it("assigns the data to loadedData", async () => {
        setGlobalFetch();
        spyOn(globalThis, "fetch").and.callThrough();

        const app = getApp()
        const route = getRoute();
        await dataLoader(app, route);
        expect(route.loadedData).toEqual({});
    });
});

function getApp() {
    return {
        path: {
            data: "https://www.example.com/api/foo/*name*"
        },
        fileExtension: {}
    };
}

function getRoute() {
    return {
        name: "bar"
    };
}
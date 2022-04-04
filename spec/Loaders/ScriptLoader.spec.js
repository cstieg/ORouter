import scriptLoader from "../../src/scripts/Loaders/ScriptLoader.js";

describe("scriptLoader", () => {
    it("dynamically imports the script to loadedScript", async () => {
        const app = getApp();
        const route = getRoute();
        await scriptLoader(app, route);

        expect(route.importedScript).toBe(null);
    });
});

function getApp() {
    return {
        path: {
            script: "https://www.example.com/static/*name*"
        },
        fileExtension: {
            script: ".js"
        },
        onLoadError: [function () { }]
    };
}

function getRoute() {
    return {
        name: "bar"
    };
}
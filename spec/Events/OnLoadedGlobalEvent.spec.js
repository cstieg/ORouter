import onLoadedGlobalEvent from "../../src/scripts/Events/OnLoadedGlobalEvent.js";

describe("onLoadedGlobalEvent", () => {
    it("calls functions in app.onLoaded array", () => {
        const functions = {
            onLoaded1: function () { },
            onLoaded2: function () { }
        };
        spyOn(functions, "onLoaded1");
        spyOn(functions, "onLoaded2");

        const app = {
            onLoaded: [
                functions.onLoaded1,
                functions.onLoaded2
            ]
        };
        const route = {};

        onLoadedGlobalEvent(app, route);

        expect(functions.onLoaded1).toHaveBeenCalled();
        expect(functions.onLoaded2).toHaveBeenCalled();
    });
});
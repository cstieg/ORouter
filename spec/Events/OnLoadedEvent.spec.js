import onLoadedEvent from "../../src/scripts/Events/OnLoadedEvent.js";

describe("onLoadedEvent", () => {
    it("calls importedScript.onLoaded", () => {
        const app = {};
        const route = {
            importedScript: {
                onLoaded: () => {}
            }
        };
        spyOn(route.importedScript, "onLoaded");
        onLoadedEvent(app, route);
        expect(route.importedScript.onLoaded).toHaveBeenCalled();
    });
});
import onRenderedEvent from "../../src/scripts/Events/OnRenderedEvent.js";

describe("onRenderedEvent", () => {
    it("calls importedScript.onRendered", () => {
        const app = {};
        const route = {
            importedScript: {
                onRendered: () => {}
            }
        };
        spyOn(route.importedScript, "onRendered");
        onRenderedEvent(app, route);
        expect(route.importedScript.onRendered).toHaveBeenCalled();
    });
});
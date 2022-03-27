import beforeLoadEvent from "../../src/scripts/Events/BeforeLoadEvent.js";

describe("BeforeLoadEvent", () => {
    it("returns true if there is no importedScript", () => {
        const app = {};
        const route = {};
        const result = beforeLoadEvent(app, route);
        expect(result).toBe(true);
    });

    it("returns true if there is no importedScript.beforeLoad", () => {
        const app = {};
        const route = {
            importedScript: {}
        };
        const result = beforeLoadEvent(app, route);
        expect(result).toBe(true);
    });

    it("calls importedScript.beforeLoad", () => {
        const app = {};
        const route = {
            importedScript: {
                beforeLoad: () => {}
            }
        };
        spyOn(route.importedScript, "beforeLoad");
        const result = beforeLoadEvent(app, route);
        expect(route.importedScript.beforeLoad).toHaveBeenCalled();
        expect(result).toBeTrue();
    });
});
import onRenderedGlobalEvent from "../../src/scripts/Events/OnRenderedGlobalEvent.js";

describe("onRenderedGlobalEvent", () => {
    it("calls functions in app.Rendered array", () => {
        const functions = {
            onRendered1: function () { },
            onRendered2: function () { }
        };
        spyOn(functions, "onRendered1");
        spyOn(functions, "onRendered2");

        const app = {
            onRendered: [
                functions.onRendered1,
                functions.onRendered2
            ]
        };
        const route = {};

        onRenderedGlobalEvent(app, route);

        expect(functions.onRendered1).toHaveBeenCalled();
        expect(functions.onRendered2).toHaveBeenCalled();
    });
});
import cssRenderer from "../../src/scripts/Renderers/CssRenderer.js";

describe("cssRenderer", () => {
    it("renders css in the document head", async () => {
        const app = {};
        const route = {
            id: "/foo/bar",
            loadedCss: "a { color: black; }"
        };

        globalThis.document = {
            head: {
                insertAdjacentHTML: function (where, html) { }
            }
        };

        spyOn(globalThis.document.head, "insertAdjacentHTML");

        await cssRenderer(app, route);
        expect(document.head.insertAdjacentHTML).toHaveBeenCalledWith("beforeend", `<style>[name=data-currentRouteId][value="/foo/bar"] a { color: black; }</style>`);
    });
});
import htmlRenderer from "../../src/scripts/Renderers/HtmlRenderer.js";

describe("htmlRenderer", () => {
    it("loads html from the specified path", async () => {
        const app = getApp();
        const route = getRoute();
        await htmlRenderer(app, route);
        expect(app.root.innerHTML).toBe("<body></body>");
    });
});

function getApp() {
    return {
        root: { }
    };
}

function getRoute() {
    return {
        loadedHtml: "<body></body>"
    };
}
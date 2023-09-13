import getUrl from "../src/scripts/GetUrl.js";

describe("getUrl", () => {
    it("returns the fileName if absolutely specified", () => {
        const app = {};
        const route = {};

        const url = getUrl(app, route, "html", "https://www.example.com/index.html");
        expect(url).toBe("https://www.example.com/index.html");
    });

    it("returns the fileName if relatively specified", () => {
        const app = {};
        const route = {};

        const url = getUrl(app, route, "html", "./index.html");
        expect(url).toBe("./index.html");
    });

    it("gets the URL specified in app.path", () => {
        const app = {
            path: {
                html: "https://www.example.com/index.html"
            },
            fileExtension: {
                html: ".html"
            }
        };
        const route = {};

        const url = getUrl(app, route, "html", "foo");
        expect(url).toBe("https://www.example.com/index.html");
    });

    it("replaces variables from namespace and name", () => {
        const app = {
            path: {
                html: "/static/*namespace*/*name*"
            },
            fileExtension: {
                html: ".html"
            }
        };
        const route = {
            namespace: "foo"
        };

        const url = getUrl(app, route, "html", "bar.html");
        expect(url).toBe("/static/foo/bar.html");
    });
});
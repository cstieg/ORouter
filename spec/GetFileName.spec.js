import getFileName from "../src/scripts/GetFileName.js";

describe("getFileName", () => {
    it("constructs a file name from route properties", () => {
        const app = {
            fileExtension: {
                html: ".html"
            }
        };
        const route = {
            name: "foo",
            fileExtension: {
                html: ".html"
            }
        };

        const fileName = getFileName(app, route, "html");
        expect(fileName).toBe("foo.html");
    });

    it("constructs a file name from app properties", () => {
        const app = {
            fileExtension: {
                html: ".html"
            }
        };
        const route = {
            name: "foo"
        };

        const fileName = getFileName(app, route, "html");
        expect(fileName).toBe("foo.html");
    });
});
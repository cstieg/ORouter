import joinPath from "../../src/scripts/Helpers/JoinPath.js";

describe("joinPath", () => {
    it("combines strings with slash", () => {
        const args = [
            "foo",
            "bar",
            "baz"
        ];
        const path = joinPath(...args);
        expect(path).toBe("foo/bar/baz");
    });

    it("combines strings with slash, eliminating redundant slashes", () => {
        const args = [
            "foo",
            "/bar/",
            "/baz"
        ];
        const path = joinPath(...args);
        expect(path).toBe("foo/bar/baz");
    });

    it("combines strings with slash, retaining initial slash", () => {
        const args = [
            "/foo",
            "bar",
            "baz"
        ];
        const path = joinPath(...args);
        expect(path).toBe("/foo/bar/baz");
    });
});

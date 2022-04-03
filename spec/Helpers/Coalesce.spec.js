import groupByChange from "../../src/scripts/Helpers/Coalesce.js";

describe("coalesce", () => {
    const dataSets = [
        { a: 1, b: 2, result: 1 },
        { a: undefined, b: 2, result: 2 },
        { a: 7, b: undefined, result: 7 },
        { a: undefined, b: undefined, result: undefined },
        { a: null, b: 9, result: null }
    ];

    dataSets.forEach(dataSet => {
        it("returns the first value if defined, otherwise the second value", () => {
            const result = groupByChange(dataSet.a, dataSet.b);
            expect(result).toBe(dataSet.result);
        });
    });
});
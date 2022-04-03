import groupByChange from "../../src/scripts/Helpers/GroupByChange.js";

describe("groupByChange", () => {
    it("Splits an array of objects into array of arrays.  When a specified property of the object is different from the previous, a new group is started.", () => {
        const objects = [
            { prop: true },
            { prop: false },
            { prop: false },
            { prop: true },
            { prop: true },
            { prop: true }
        ];
        const expectedResult = [
            [
                { prop: true }
            ],
            [
                { prop: false },
                { prop: false }
            ],
            [
                { prop: true },
                { prop: true },
                { prop: true }
            ]
        ]
        const result = groupByChange(objects, "prop");
        expect(result).toEqual(expectedResult);
    });
});
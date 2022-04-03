import coalesceRecursive from "../../src/scripts/Helpers/CoalesceRecursive.js";

describe("coalesceRecursive", () => {
    const dataSets = [
        {
            a: {
                prop1: "Hi",
                prop3: "!"
            },
            b: {
                prop1: "Hello",
                prop2: "World"
            },
            result: {
                prop1: "Hi",
                prop2: "World",
                prop3: "!"
            }
        },
        {
            a: {
                sub1: {
                    bar: true,
                    baz: false
                }
            },
            b: {
                sub1: {
                    foo: true,
                    bar: "bar",
                    baz: "baz"
                },
                prop2: "string"
            },
            result: {
                sub1: {
                    bar: true,
                    baz: false,
                    foo: true
                },
                prop2: "string",
            }
        }
    ];

    dataSets.forEach(dataSet => {
        it("copies properties of dictionary objects from the source to the target recursively if they do not exist already in the target", () => {
            const result = coalesceRecursive(dataSet.a, dataSet.b);
            expect(result).toEqual(dataSet.result);
        });
    });

    it("throws if non-objects are passed", () => {
        expect(() => coalesceRecursive({}, "hello")).toThrow();
        expect(() => coalesceRecursive("hello", {})).toThrow();
    });
});
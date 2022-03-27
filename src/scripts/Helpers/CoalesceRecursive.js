/**
 * Copies properties of dictionary objects from the source to the target recursively if they do not exist already in the target.
 * @param {any} target
 * @param {any} source
 */
export default function coalesceRecursive(target, source) {
    if (typeof source !== "object" || Array.isArray(source)) { throw "Source must be dictionary object"; }
    if (!target) { target = Object.assign({}, source); }
    if (typeof target !== "object" || Array.isArray(target)) { throw "Target must be dictionary object"; }
    for (const sourceKey of Object.keys(source)) {
        const sourceValue = source[sourceKey];
        if (sourceKey in target) {
            const targetValue = target[sourceKey];
            if (typeof sourceValue === "object" && !Array.isArray(sourceValue)
                && typeof (targetValue === "object" && !Array.isArray(targetValue))) {
                coalesceRecursive(targetValue, sourceValue);
            }
        }
        else if (typeof sourceValue === "object") {
            target[sourceKey] = Object.assign({}, sourceValue);
        }
        else {
            target[sourceKey] = sourceValue;
        }
    }
    return target;
}
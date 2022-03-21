/**
 * Splits an array of objects into array of arrays.  When a specified property of the object is different from the previous, a new group is started.
 * @param {any} arr     The array of objects
 * @param {any} prop    The specified property of the object to group on
 */
export default function groupByChange(arr, prop) {
    const groups = [];
    if (!arr.length) { return groups; }
    let currentGroup = [];
    let previousProp = arr[0][prop];
    for (const item of arr) {
        const currentProp = item[prop];

        if (currentProp !== previousProp) {
            groups.push(currentGroup);
            currentGroup = [];
            previousProp = currentProp;
        }

        currentGroup.push(item);
    }
    groups.push(currentGroup);
    return groups;
}
export default function coalesce(value1, value2) {
    if (value1 !== undefined) { return value1; }
    return value2;
}
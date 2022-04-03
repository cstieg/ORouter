const pathSlashRegex = new RegExp("(?<!:|:/)/", "g"); // Matches all forward slashes except after : as in http://

export default function joinPath() {
    if (arguments.length === 0) { throw "Must pass arguments to joinPath"; }
    for (const argument in arguments) {
        if (typeof argument !== "string") { throw "Arguments must be strings" }; 
    }
    const argumentArray = [...arguments];
    const startsWithSlash = arguments[0].startsWith("/");
    return (startsWithSlash ? "/" : "")
        + argumentArray
        .join("/")
        .split(pathSlashRegex)
        .filter(el => el)
        .join("/")
        .toLowerCase();
}
const pathSlashRegex = new RegExp("(?<!:|:/)/", "g"); // Matches all forward slashes except after : as in http://

export default function joinPath() {
    if (arguments.length === 0) { throw "Must pass arguments to joinPath"; }
    for (const argument of arguments) {
        if (typeof argument !== "string") { throw "Arguments must be strings" }; 
    }
    const startsWithSlash = arguments[0].startsWith("/");
    return (startsWithSlash ? "/" : "")
        + [...arguments]
            .join("/")
            .split(pathSlashRegex)
            .filter(el => el)
            .join("/")
            .toLowerCase();
}
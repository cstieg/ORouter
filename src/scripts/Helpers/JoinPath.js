const pathSlashRegex = new RegExp("(?<!:|:/)/", "g"); // Matches all forward slashes except after : as in http://

export default function joinPath() {
    if (arguments.length === 0) { throw "Must pass arguments to joinPath"; }

    const components = [...arguments].filter(c => c);
    for (const component of components) {
        if (typeof component !== "string") { throw "Arguments must be strings" }; 
    }
    const startsWithSlash = components[0].startsWith("/");
    return (startsWithSlash ? "/" : "")
        + components
            .join("/")
            .split(pathSlashRegex)
            .filter(el => el)
            .join("/")
            .toLowerCase();
}
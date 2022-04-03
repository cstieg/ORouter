export default function cssRenderer(app, route) {
    if (!route.loadedCss) { return; }
    const scopedCss = addScopeToCss(route.loadedCss, `[data-currentrouteid="${route.id}"]`);
    document.head.insertAdjacentHTML("beforeend", `<style>${scopedCss}</style>`)
}

// Match selector followed by comma, or selector followed curly braces
const CssRegex = new RegExp("[^,{}]+,\n?|[^,{}]+{[^,{}]+}", "gi");

function addScopeToCss(css, scope) {
    return css.replace(CssRegex, `${scope} $&`);
}
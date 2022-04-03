import htmlRenderer from "./Renderers/HtmlRenderer.js";

export default function populateRenderers(HashRouter) {
    HashRouter.renderers = {
        cssRenderer,
        htmlRenderer
    };
}
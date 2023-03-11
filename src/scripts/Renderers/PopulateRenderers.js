import cssRenderer from "./CssRenderer.js";
import htmlRenderer from "./HtmlRenderer.js";

export default function populateRenderers(Router) {
    Router.renderers = {
        cssRenderer,
        htmlRenderer
    };
}
import cssRenderer from "./CssRenderer.js";
import htmlRenderer from "./HtmlRenderer.js";

export default function populateRenderers(ORouter) {
    ORouter.renderers = {
        cssRenderer,
        htmlRenderer
    };
}
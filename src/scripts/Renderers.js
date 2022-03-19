import { htmlRenderer } from "./Renderers/HtmlRenderer.js";

export function populateRenderers(HashRouter) {
    HashRouter.renderers = {
        htmlRenderer
    };
}
import cssLoader from "./CssLoader.js";
import dataLoader from "./DataLoader.js";
import htmlLoader from "./HtmlLoader.js";
import templateLoader from "./TemplateLoader.js";

import scriptLoader from "./ScriptLoader.js";

export default function populateLoaders(Router) {
    Router.loaders = {
        cssLoader,
        dataLoader,
        htmlLoader,
        templateLoader,

        scriptLoader
    };
}
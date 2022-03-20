import dataLoader from "./Loaders/DataLoader.js";
import htmlLoader from "./Loaders/HtmlLoader.js";
import templateLoader from "./Loaders/TemplateLoader.js";

import scriptLoader from "./Loaders/ScriptLoader.js";

export default function populateLoaders(HashRouter) {
    HashRouter.loaders = {
        dataLoader,
        htmlLoader,
        templateLoader,

        scriptLoader
    };
}
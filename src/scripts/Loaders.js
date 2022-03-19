import dataLoader from "./Loaders/DataLoader.js";
import htmlLoader from "./Loaders/HtmlLoader.js";
import templateLoader from "./Loaders/TemplateLoader.js";

export default function populateLoaders(HashRouter) {
    HashRouter.loaders = {
        dataLoader,
        htmlLoader,
        templateLoader
    };
}
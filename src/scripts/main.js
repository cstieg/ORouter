import addRoutes from './AddRoutes.js';
import getUrl from './GetUrl.js';
import { init } from './Navigation.js';
import populateLoaders from './Loaders/PopulateLoaders.js';
import populateRenderers from './Renderers/PopulateRenderers.js';
import { setOptions } from './Options.js';

/**
 * Router constructor
 * @constructor
 * @param {object} [options]  Options object
 */
export function ORouter(options) {
    const app = this;
    app.addRoutes = addRoutes.bind(app);
    app.init = init.bind(app);
    app.getUrl = getUrl.bind(app);
    setOptions(app, options);
}

populateLoaders(ORouter);
populateRenderers(ORouter);
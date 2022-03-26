import { setOptions } from './Options.js';
import { addRoutes } from './AddRoutes.js';
import { init } from './Navigation.js';
import { populateRenderers } from './Renderers.js';
import populateLoaders from './Loaders.js';

/**
 * Router constructor
 * @constructor
 * @param {object} [options]  Options object
 */
export function Router(options) {
    const app = this;
    setOptions(app, options);
    app.addRoutes = addRoutes.bind(app);
    app.init = init.bind(app);
}

populateLoaders(Router);
populateRenderers(Router);
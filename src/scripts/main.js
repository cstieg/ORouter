import { setOptions } from './Options.js';
import { addRoutes } from './AddRoutes.js';
import { init } from './Navigation.js';
import populateLoaders from './Loaders.js';

export function HashRouter(options) {
    const app = this;
    setOptions(app, options);
    app.addRoutes = addRoutes.bind(app);
    app.init = init.bind(app);
}

populateLoaders(HashRouter);

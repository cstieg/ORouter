# Occam's Router
## Introduction
William of Occam was a 14th century English philosopher who is credited with Occam's Razor,
which posits that the explanation that involves the least assumptions is the most likely.
In other words, the simpler the better.

This is the philosophy behind Occam's Router.  I'd like to think that this is the SPA router that
William would have written had he lived today and had an interest in building Javascript frameworks.

It allows routes to be defined for various screens, and loads HTML, scripts, styles, or templates
when the user navigates to those routes.  It renders that content in a div without reloading the page.

It is simple to use out of the box, but can easily be configured to meet almost any scenario,
and is easily extended. It has 0 dependencies and a micro footprint.

As content is loaded and rendered after the initial page load, this router may not be the best choice
to use for external facing applications if Search Engine Optimization is a concern.
However, it is ideal for intranet applications that have a plethora of screens to route.


## Setup
Note that the web server should be set up to route all urls of the application to index.html.  
A `static/` folder should also be set up to serve static content. 

## Usage

```
<!-- index.html -->
<body>
    <div id="app"></div>
    <script type="module" src="app.js"></script>
</body>
</html>
```

```
// app.js
import { ORouter } from "./ORouter.js";
const router = new ORouter({
    root: "app"
});
router.addRoutes([
    { name: "bar", loadedHtml: "<h1>Hello for bar</h1><a href='foo/baz'>Baz</a>", defaultParameters: "a=1&b=2" },
    { name: "baz", loadedHtml: "<h1>Hello for baz</h1><a href='foo/bar'>Bar</a>" },
], { namespace: "foo" });
router.init();
```

## Syntax

### ORouter
* **Constructor** 
`new ORouter(options)`

Properties can be passed in through the options object
```
var router = new ORouter({ root: "app" });
```
or set on the ORouter object.
```
router.root = "app";
```


* **Properties**
  * `root`
    * Type: HTMLElement | string
    * Description: Element where page is to be rendered, or id of that element
  * `routes`
    * Type: object[]
    * Description: Array of routes
  * `namespace`
    * Type: string
    * Description: Prefix to be added to all routes
  * `path`
    * Type: object
    * Description: Default path for different types of resources
    * Members:
      * `css`
      * `data`
      * `html`
      * `script`
      * `template`
    * Special variables:
      * `*namespace*`: Substitutes the namespace of the route
      * `*name*`: Substitutes the name of the route
    * Default: `/static/*namespace*/*name*`
  * `fileExtension`
    * Type: object
    * Description: Default extension for different types of resources
    * Members:
      * `css`: Default ".css"
      * `html`: Default ".html"
      * `js`: Default ".js"
  * `scriptLoader`
    * Type: function
    * Parameters:
      * `app`
      * `route`
    * Description: Loader to load script(s). Script loaded may have the following functions:
      * `beforeLoad`: Executed before other items are loaded.  If returns false, load will be cancelled.
      * `onLoaded`: Executed after all loading is complete and global `onLoaded` is executed.
      * `onRendered`: Executed after view is rendered and global `onRendered` is executed.
    * Default: `constructor.loaders.scriptLoader`
  * `loader`
    * Type: function | function[]
    * Description: Loader or array of loaders that load template, data, etc., before render.  Loader should return Promise.
    * Default: `[constructor.loaders.htmlLoader]`
  * `renderer`
    * Type: function | function[]
    * Description: Renderer or array of renderers that render html, template, data, etc.  Renderer should return Promise.
    * Default: `[constructor.renderers.htmlRenderer]`
* **Events**
  * `onLoaded`: Executes after all loading is complete
  * `onLoadError`: Executes when an exception is thrown while loading.  `function(e, app, route, loader)`
  * `onRendered`: Executes after all rendering is complete
  * `onRenderError`: Executes when an exception is thrown while rendering
* **Methods**
  * `addRoutes`
    * Description: Adds a collection of Routes with a set of options.
    * Parameters:
      * `routes` - an array of Route objects to add
      * `options` - an Options object to apply to the set of routes.  Can specify a `namespace`.
  * `init`
    * Description: Enables the ORouter.


### Route
* Type: Object
* **Properties**
  * `name`
    * Type: string
    * Description: Name of the route
  * `namespace`
    * Type: string
    * Description: Namespace that is prefixed to the route name
  * `defaultParameters`
    * Type: string
    * Description: Default parameters that are passed into URL and data get
    * Example: "a=1&b=2"
  * `parameters`
    * Type: object
    * Description: Parameters passed from URL.
  * `html`
    * Type: string
    * Description: The filename of the html to load by `htmlLoader`.  Rendered by `htmlRenderer`.
  * `template`
    * Type: string
    * Description: The filename of the template to load by `templateLoader`.
  * `script`
    * Type: string
    * Description: The filename of the script to load.  Used with `scriptLoader`.
  * `data`
    * Type: string
    * Description: The URL of the data to load.  Used with `dataLoader`.
  * `loadedHtml`
    * Type: string
    * Description: The HTML content loaded by `htmlLoader` and rendered by `htmlRenderer`.
  * `loadedTemplate`
    * Type: string
    * Description: The template loaded by `templateLoader`.
  * `importedScript`
    * Type: script
    * Description: The script imported by `scriptLoader`.
  * `loader`
    * Type: function | function[]
    * Description: Loader or array of loaders that load template, data, etc., before render.  Loader should return Promise.
    * Overrides app option
  * `render`
    * Type: function | function[]
    * Description: Renderer or array of renderers that render html, template, data, etc. Loader should return Promise.
    * Overrides app option
* Special options
  * Load specifications may be set to null, false, or empty string to suppress loading the default filename for the loader.
  * If globally suppressed in options, the default may be restored on a route by specifying the value as true.
  * Example:  
 ```
// app.js
...
router.addRoutes([
    { name: "bar", loadedHtml: "<h1>Hello for bar</h1><a href='foo/baz'>Baz</a>", defaultParameters: "a=1&b=2", script: false },
    { name: "baz", loadedHtml: "<h1>Hello for baz</h1><a href='foo/bar'>Bar</a>", css: true },
], { namespace: "foo", css: false });
...
```
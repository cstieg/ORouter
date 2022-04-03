export default function htmlRenderer(app, route) {
    if (!route.loadedHtml) { return; }
    app.root.innerHTML = route.loadedHtml;
}
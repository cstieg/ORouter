export default function setGlobalFetch() {
    const okResponse = { body: "", status: 200, statusText: 'OK', ok: true, json: () => ({ }), text: () => "" };
    globalThis.fetch = () => new Promise(resolve => resolve(okResponse));
}
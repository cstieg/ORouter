import { terser } from "rollup-plugin-terser";

export default {
    input: 'src/scripts/main.js',
    output: [
        {
            file: 'build/js/ORouter.min.js',
            name: 'ORouter',
            format: 'iife',
            plugins: [
                terser()
            ]
        },
        {
            file: 'test/ORouter.js',
            name: 'ORouter',
            format: 'module',
        }
    ]
};
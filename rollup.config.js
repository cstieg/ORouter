import { uglify } from 'rollup-plugin-uglify';

export default {
    input: 'src/scripts/main.js',
    output: [
        {
            file: 'build/js/ORouter.min.js',
            name: 'ORouter',
            format: 'iife',
            plugins: [
                uglify()
            ]
        },
        {
            file: 'test/ORouter.js',
            name: 'ORouter',
            format: 'module',
        }
    ]
};
import { uglify } from 'rollup-plugin-uglify';

export default {
    input: 'src/scripts/main.js',
    output: [
        {
            file: 'build/js/Router.min.js',
            name: 'Router',
            format: 'iife',
            plugins: [
                uglify()
            ]
        },
        {
            file: 'test/Router.js',
            name: 'Router'
        }
    ]
};
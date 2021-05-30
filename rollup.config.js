import { uglify } from 'rollup-plugin-uglify';

export default {
    input: 'src/scripts/main.js',
    output: {
        file: 'build/js/HashRouter.min.js',
        name: 'HashRouter',
        format: 'iife'
    },
    plugins: [
        uglify()
    ]
};
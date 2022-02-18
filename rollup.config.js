import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";

export default {
    input: './index.js',
    output: {
        file: 'dist/_worker.js',
        format: 'esm',
    },
    plugins: [
        commonjs({
            include: ["node_modules/**"]
        }),
        nodeResolve({
            include: ["node_modules/**"],
        }),
        babel({
            extensions: ['.jsx', '.js', '.tsx'],
            exclude: ["node_modules/**"],
            babelHelpers: "bundled",
        }),
        terser()
    ],
}
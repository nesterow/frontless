import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
// import globals from 'rollup-plugin-node-globals'
import minify from 'rollup-plugin-babel-minify'
import scss from 'rollup-plugin-scss'

export default [
  {
    input: 'src/App.jsx',
    output: {
      file: 'assets/bundle.js',
      format: 'umd',
      globals: {
        'process/browser': 'process'
      }
    },
    plugins: [
      resolve(),
      commonjs({
        namedExports: {
        'node_modules/react/index.js': [ 'Component' ]
      }}),
      json(),
      babel({
        exclude: 'node_modules/**'
      }),
      (process.ENV === 'production' && minify({
        comments: false,
      })),
      scss()
    ]
  },
  {
    input: 'src/server.js',
    output: {
      file: 'dist/bundle.js',
      format: 'umd'
    },
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs({
        namedExports: {
        'node_modules/react/index.js': [ 'Component' ]
      }}),
      json(),
      babel({
        exclude: 'node_modules/**'
      }),
      scss()
    ]
  }
]
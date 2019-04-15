import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import globals from 'rollup-plugin-node-globals';
import minify from 'rollup-plugin-babel-minify';
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
      globals({
        dirname: false,
        buffer: false,
        filename: false,
        baseDir: false,
      }),
      minify({
        comments: false,
      }),
    ]
  },
  {
    input: 'src/server.js',
    output: {
      file: 'dist/bundle.js',
      format: 'umd'
    },
    // All the used libs needs to be here
    external: [
      'react', 
      'react-dom', 
      'react-proptypes',
      'express',
    ],
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs(),
      json(),
      babel({
        exclude: 'node_modules/**'
      }),
    ]
  }
]
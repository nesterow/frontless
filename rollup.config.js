import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import globals from 'rollup-plugin-node-globals'
import alias from 'rollup-plugin-strict-alias';
import minify from 'rollup-plugin-babel-minify'
import scss from 'rollup-plugin-scss'

const optPlugins = []


if (process.ENV !== 'production') {
  
  optPlugins.push(globals());
}

if (process.ENV === 'production') {
  optPlugins.push(minify({
    comments: false,
  }))
}

export default [
  {
    input: 'src/App.jsx',
    output: {
      file: 'assets/bundle.js',
      format: 'umd',
    },
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false,
        modulesOnly: false
      }),
      alias({
        events: 'node_modules/events/events.js'
      }),
      commonjs({
        namedExports: {
          'lib/index.js': [ 'withFrontless' ],
          'node_modules/react/index.js': [ 'Component', 'createElement' ]
        }
      }),
      json(),
      babel({
        exclude: 'node_modules/**'
      }),
      scss(),
      ...optPlugins
    ]
  },
  {
    input: 'src/server.js',
    output: {
      file: 'dist/bundle.js',
      format: 'cjs'
    },
    external: [
      'uws'
    ],
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs({
        namedExports: {
          'lib/index.js': [ 'withFrontless' ],
          'node_modules/react/index.js': [ 'Component', 'createElement' ]
        }
      }),
      json(),
      babel({
        exclude: 'node_modules/**'
      }),
      scss()
    ]
  }
]
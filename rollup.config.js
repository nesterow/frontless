import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import globals from 'rollup-plugin-node-globals'
import alias from 'rollup-plugin-strict-alias';
import minify from 'rollup-plugin-babel-minify'
import scss from 'rollup-plugin-scss'
import postprocess from 'rollup-plugin-postprocess';
import cssbundle from 'rollup-plugin-css-bundle'

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
    sourcemap: false,
    treeshake: false,
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
          'node_modules/react-is/index.js': [ 'isForwardRef', 'isElement', 'isValidElementType', 'ForwardRef' ],
          'node_modules/react-dom/index.js': [ 'findDOMNode', 'createPortal' ],
          'node_modules/react/index.js': [ 'Component', 'createElement', 'Children', 'isValidElement', 'cloneElement', 'PureComponent', 'createRef', 'Fragment', 'createFactory', 'createContext', 'useState' ]
        }
      }),
      json(),
      babel({
        exclude: 'node_modules/**'
      }),
      ...optPlugins
    ]
  },
  {
    input: 'src/server.js',
    sourcemap: false,
    treeshake: false,
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
          'node_modules/react-is/index.js': [ 'isForwardRef', 'isElement', 'isValidElementType', 'ForwardRef' ],
          'node_modules/react-dom/index.js': [ 'findDOMNode', 'createPortal' ],
          'node_modules/react/index.js': [ 'Component', 'createElement', 'Children', 'isValidElement', 'cloneElement', 'PureComponent', 'createRef', 'Fragment', 'createFactory', 'createContext', 'useState' ]
        }
      }),
      json(),
      babel({
        exclude: 'node_modules/**'
      }),
      postprocess([
        [/commonjsRequire\.resolve/ig, 'require\.resolve'],
        [/_isInBrowser2\[\'default\'\]/ig, 'false']
      ])
    ]
  },
  {
    input: 'src/styles.js',
    output: {
      file: 'assets/styles.js',
      format: 'cjs'
    },
    plugins: [
      scss()
    ]
  }
]
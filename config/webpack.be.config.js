const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');


const server = {
  entry: {
    server: './src/server.js',
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    publicPath: '/dist/',
    filename: '[name].js',
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.tag$/,
        exclude: /node_modules/,
        use: [{
          loader: path.resolve('./config/page.loader.js'),
          options: {
            type: 'es6',
          },
        }],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-proposal-class-properties'],
            presets: [
              ['@babel/preset-env',
                {
                  'targets': {
                    'node': 'current',
                  }
                }],
            ],
          },
        },
      },
    ],
  },
};

module.exports = server;

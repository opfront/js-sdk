'use strict';

var webpack = require('webpack');
var paths = require('./paths');

const browserConfig = {
  target: 'web',
  // We generate sourcemaps in production. This is slow but gives good results.
  devtool: 'source-map',
  entry: [paths.appIndexJs],
  output: {
    // The build folder.
    path: paths.appBuild,
    filename: 'opfront.js',
    library: 'opfront',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      // Process JS with Babel.
      {
        test: /\.js$/,
        include: paths.appSrc,
        exclude: paths.appNodeModules,
        loader: 'babel-loader',
      }
    ]
  },
  plugins: [
    // Minify the code.
    new webpack.optimize.UglifyJsPlugin({
      sourceMap : true,
      compress: {
        screw_ie8: true,
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    process: false
  }
};

const nodeConfig = Object.assign(
  {},
  browserConfig,
  {
    target: 'node',
    output: {
      path: paths.appBuild,
      filename: 'opfront-node.js',
      library: 'opfront',
      libraryTarget: 'commonjs2'
    }
  }
)


module.exports = [nodeConfig, browserConfig]

'use strict';

var _ = require('lodash'),
    webpack = require('webpack'),
    path = require('path');

var phaserModule = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
  pixi = path.join(phaserModule, 'build/custom/pixi.js'),
  p2 = path.join(phaserModule, 'build/custom/p2.js');

var $ = process.env;

var debug = $.NODE_ENV !== 'production';
if (debug) console.log('-Running dev build-');

module.exports = {
  devServer: {
    contentBase: 'app/public',
    historyApiFallback: true,
    hot: true
  },
  context: __dirname,
  node: {
    process: true
  },
  devtool: debug ? 'inline-sourcemap' : null,
  entry: debug ? [
    './app/public/stylesheet.css',
    './app/index.js',
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080'
  ] : './app/index.js',
  output: {
    path: './app/public',
    publicPath: '/',
    filename: 'scripts.min.js'
  },
  module: {
    preLoaders: debug ? [{
      test:    /\.js$/,
      exclude: /node_modules/,
      loader: 'jshint-loader'
    }, {
      test:    /\.js$/,
      exclude: /node_modules/,
      loader: 'jscs-loader'
    }] : [],
    loaders: _.flatten([
      // [{
      //   test: /pixi.js/,
      //   loader: 'script'
      // }],
      debug ? [{
        test:   /\.css$/,
        loader: 'style-loader!css-loader'
      }] : []
    ])
  },
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: [
      'node_modules',
      'app',
      'app/src',
      'lib'
    ],
    alias: {
      'phaser': phaser,
      'pixi.js': pixi,
      'p2': p2
    }
  },
  plugins: debug ? [
    new webpack.HotModuleReplacementPlugin()
  ] : [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(_.pick(
        $, 'NODE_ENV'
      ))
    }),
    new webpack.optimize.UglifyJsPlugin({mangle: false}),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin()
  ]
};
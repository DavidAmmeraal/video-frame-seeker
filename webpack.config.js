const path = require('path');
const webpack = require('webpack');

const libraryName = 'video-frame';
const context = path.resolve(__dirname, './src');
const outputFile = libraryName + '.js';

module.exports = {
  context: context,
  entry: {
    app: [
      './index'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    publicPath: '/',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
   rules: [
     {
       test: /\.js$/,
       exclude: [/node_modules/],
       use: [{
         loader: 'babel-loader'
       }]
     }
   ]
  },
  devtool: 'eval',
  plugins: [],
  target: 'web'
};

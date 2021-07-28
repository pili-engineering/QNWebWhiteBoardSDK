const { override, addWebpackPlugin } = require('customize-cra');
const webpack = require('webpack');
const packageJSON = require('./package.json');

console.log('白板 Demo 版本：', packageJSON.version);

module.exports = override(
  addWebpackPlugin(
    new webpack.DefinePlugin({
      version: JSON.stringify(packageJSON.version)
    })
  )
);
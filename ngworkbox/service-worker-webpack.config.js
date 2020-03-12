const webpack = require('webpack');
const Terser = require('terser-webpack-plugin');
const path = require('path');

module.exports = {
  mode: "production",
  entry: path.join(__dirname, "src", "service-worker.ts"),
  output: {
    path: path.join(__dirname, "dist", "ngworkbox"),
    filename: "service-worker.js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
		exclude: /node_modules/,
        options: {
          onlyCompileBundledFiles: true
        }
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
  optimization: {
    minimizer: [new Terser({
      test: /\.js$/,
    })]
  }
};

const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'src', 'service-worker.ts'),
  output: {
    path: path.join(__dirname, 'src'),
    filename: 'service-worker.js'
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          onlyCompileBundledFiles: true
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.wasm', '.mjs', '.js', '.json']
  }
};

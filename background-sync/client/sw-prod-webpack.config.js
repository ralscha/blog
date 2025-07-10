const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'src', 'service-worker.ts'),
  output: {
    path: path.join(__dirname, 'dist', 'app', 'browser'),
    filename: 'service-worker.js'
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

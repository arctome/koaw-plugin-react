const webpack = require('webpack')

module.exports = {
  mode: "production",
  entry: "./test/pages-with-router/worker.js",
  target: "webworker",
  // module/loaders configuration
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser__: false
    }),
  ]
}
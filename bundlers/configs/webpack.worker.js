const isProd = process.env.NODE_ENV === 'production'
const webpack = require('webpack')

module.exports = {
  mode: isProd ? "production" : "development",
  entry: "./src/index.js",
  target: "webworker",
  module: {
    rules: [
      // Add jsx loader with `@babel/preset-react` for `React.renderToString`.
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
    // Define runtime env flag.
    new webpack.DefinePlugin({
      __isBrowser__: false
    }),
  ]
}
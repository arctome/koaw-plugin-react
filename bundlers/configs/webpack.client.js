const path = require('path')
const isProd = process.env.NODE_ENV === 'production'
const webpack = require('webpack')
// Plugins
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// All React build assets will go to './out' folder, and files there will be upload to 'Worker KV'
module.exports = {
  mode: isProd ? "production" : "development",
  entry: "./src/pages/index.js",
  // output files and chunks
  output: {
    path: path.resolve(process.cwd(), './out'),
    filename: 'static/[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.sass', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }]
      },
      // Fix for Webpack 4 mjs issue
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      },
      {
        test: /\.(css|scss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader', 'postcss-loader']
      },
      {
        test: /\.(sass)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', {
          loader: 'sass-loader',
          options: {
            indentedSyntax: true
          }
        }, 'postcss-loader']
      }
    ]
  },
  plugins: [
    // Root HTML Template
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(process.cwd(), './src/public/index.html'),
      minify: {collapseWhitespace: true},
      prefetch: ['*.js'],
    }),
    // extract css to external stylesheet file
    new MiniCssExtractPlugin({
      filename: 'static/styles.css'
    }),
    // Move static assets from './src/public' to './out'
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(process.cwd(), './src/public'),
          to: path.resolve(process.cwd(), './out'),
          noErrorOnMissing: true
        }
      ]
    }),
    // Define runtime env flag.
    new webpack.DefinePlugin({
      __isBrowser__: true
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,

        vendor: {
          chunks: 'all', // both : consider sync + async chunks for evaluation
          name: 'vendor', // name of chunk file
          test: /node_modules/, // test regular expression
        }
      }
    }
  }
}

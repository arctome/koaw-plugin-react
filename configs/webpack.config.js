const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

/*-------------------------------------------------*/

module.exports = {

  // webpack optimization mode
  mode: ('development' === process.env.NODE_ENV ? 'development' : 'production'),

  // entry files
  entry: [
    './test/pages-with-router/index.js', // react
  ],

  // output files and chunks
  output: {
    path: path.resolve(__dirname, '../out'),
    filename: 'build/[name].js',
  },

  // module/loaders configuration
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
    },
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
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },

  // webpack plugins
  plugins: [

    // extract css to external stylesheet file
    new MiniCssExtractPlugin({
      filename: 'build/styles.css'
    }),

    // prepare HTML file with assets
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../test/pages-with-router/index.html'),
      minify: false,
    }),

    // copy static files from `src` to `dist`
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../test/react/assets'),
          to: path.resolve(__dirname, '../out/assets'),
          noErrorOnMissing: true
        }
      ]
    }),
    new WebpackModules(),
    new webpack.DefinePlugin({
      __isBrowser__: true
    }),
  ],

  // resolve files configuration
  resolve: {

    // file extensions
    extensions: ['.js', '.jsx', '.scss'],
  },

  // webpack optimizations
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
  },

  // generate source map
  devtool: 'source-map'
};
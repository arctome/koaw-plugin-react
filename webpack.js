const process = require('process')
const { merge } = require('webpack-merge');
const clientConfig = require('./bundlers/configs/webpack.client')
const workerConfig = require('./bundlers/configs/webpack.worker')
let userConfig = {}

try {
  userConfig = require('./koaw.config.js')
} catch(e) {
  console.log("koaw.config.js not found, using default configs...")
}

const BUILD_TARGET = process.env.BUILD_TARGET

let config;

if(BUILD_TARGET === 'worker') {
  config = workerConfig;
}

if(BUILD_TARGET === 'client') {
  config = merge(clientConfig, userConfig);
}

module.exports = config;
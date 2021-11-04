module.exports = {
    mode: "production",
    entry: "./test/index.js",
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
}
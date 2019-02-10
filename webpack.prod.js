var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {
    optimization: {
        minimize: true
    },
    mode: 'production',
    output: {
        filename: 'release/app.bundle.js'
    },
    plugins: [
    ]
});
const webpack = require('webpack');
const webpackMerge = require('webpack-merge').merge;
const commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {
    optimization: {
        minimize: true
    },
    mode: 'production',
    output: {
        filename: 'release/app.bundle.js'
    }
});
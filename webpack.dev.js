const webpackMerge = require('webpack-merge').merge;
const commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {
    mode: 'development',
    output: {
        filename: 'release/app.bundle.js'
    },
});
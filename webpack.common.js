const path = require('path');
const WebpackCopy = require("copy-webpack-plugin");



module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'app.bundle.js'
    },
    resolve: {
        alias: {
            Graphics: path.resolve(__dirname, 'src/graphics'),
            Game: path.resolve(__dirname, 'src/game'),
            Helpers: path.resolve(__dirname, 'src/helpers'),
            Input: path.resolve(__dirname, 'src/input'),
            Sound: path.resolve(__dirname, 'src/sound')
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new WebpackCopy({
            patterns: [
                { from: 'libs', to: 'libs' },
                { from: 'res', to: 'res' },
                { from: 'index.html', to: 'index.html'}
            ],
        }),
    ],
};
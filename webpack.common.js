var path = require('path');

module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'release/app.bundle.js'
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
                        presets: ['env']
                    }
                }
            }
        ]
    }
};
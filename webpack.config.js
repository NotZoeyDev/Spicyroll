const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    target: 'web',
    //mode: "development",
    mode: process.env.NODE_ENV == "development" ? "development" : "production",
    entry: path.resolve(__dirname, 'server', 'src', 'main.js'),
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                    process.env.NODE_ENV !== 'production'
                        ? 'vue-style-loader'
                        : MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),

        new MiniCssExtractPlugin({
            path: path.resolve(__dirname, 'server', 'assets'),
            filename: 'style.css'
        })
    ],
    output: {
        path: path.resolve(__dirname, 'server', 'assets'),
        filename: 'app.js'
    }
};
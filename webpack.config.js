const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let config = {
    target: "electron-renderer",

    node: {
        fs: 'empty'
    },

    mode: process.env.NODE_ENV,
    watch: process.env.NODE_ENV === "development",
    entry: path.resolve(__dirname, 'src', 'app.js'),
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
            path: path.resolve(__dirname, 'app', 'assets'),
            filename: 'style.css'
        })
    ],
    output: {
        path: path.resolve(__dirname, 'app', 'assets'),
        filename: 'app.js'
    }
};

if(process.env.NODE_ENV === "development") {
    config = {
        ...config,
        devtool: "inline-source-map",
        devServer: {
            hot: true,
            contentBase: path.resolve(__dirname, 'app', 'assets')
        },
        plugins: [
            ...config.plugins,
            new webpack.HotModuleReplacementPlugin()
        ]
    }
}

module.exports = config;
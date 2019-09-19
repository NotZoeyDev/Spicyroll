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
    entry: path.resolve(__dirname, 'src', 'app.js'),
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
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

console.log(config);

module.exports = config;
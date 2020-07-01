/* eslint-disable no-undef */
const path = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');


const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

//functions
const optimization = () => {
    const config = {
        splitChunks: {
            chunks: "all"
        }
    }
    if(isProd){
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }
    return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaders = preprocVar => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDev,
                reloadAll: true
            },
        },
        'css-loader'
    ]
    if(preprocVar){
        loaders.push(preprocVar)
    }
    return loaders
}

const babelOptions = preset => {
    const opts = {
        presets: [
            '@babel/preset-env'
        ],
        plugins: [
            '@babel/plugin-proposal-class-properties'
        ]
    }
    if(preset){
        opts.presets.push(preset)
    }
    return opts
}

const jsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: babelOptions()
    }]
    if (isDev){
        loaders.push('eslint-loader')
    }
    return loaders
}


const plugins = () => {
    const base = [
        new MinifyPlugin({}, {
            comments: false
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns:[
                {
                    from : path.resolve(__dirname, 'src/img'),
                    to   : path.resolve(__dirname, 'public')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ]
    return base
}

//Main module
module.exports = {
    mode: 'development',
    devtool: isDev ? 'source-map' : '',
    optimization : optimization(),
    context: path.resolve(__dirname, 'src'),
    entry: ['@babel/polyfill', './main.js', './main.scss'],
    output: {
        filename : '[name].js',
        path: path.resolve(__dirname, 'public')
    },
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
            },{
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },{
                test: /\.(png|jpg|gif|svg)$/,
                use: ['file-loader']
            },{
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },{
                test: /\.xml$/,
                use: ['xml-loader']
            },{
                test: /\.csv$/,
                use: ['csv-loader']
            },{
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            }
        ]
    }
}
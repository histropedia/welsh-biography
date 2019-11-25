const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const publicFolder = path.resolve(__dirname, '../server/public');
const viewsFolder = path.resolve(__dirname, '../server/views');

module.exports = {
    entry: path.resolve(__dirname, 'index.js'),
    output: {
        path: path.resolve(__dirname, publicFolder),
        filename: 'js/main.js',
        publicPath: publicFolder
    },

    module: {
        rules: [
            
        ]
    },

    plugins: [
        new CopyPlugin([
            { from: './css', to: publicFolder + '/css' },
            { from: './images', to: publicFolder + '/images' },
            { from: './templates', to: viewsFolder },
          ]),
    ]
}

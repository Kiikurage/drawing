const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    cache: true,
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: {
        index: path.resolve(__dirname, './src/index.tsx'),
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].[hash].js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'babel-loader' },
                    {
                        loader: '@linaria/webpack5-loader',
                        options: {
                            variableNameSlug: '[componentName]-[valueSlug]-[index]',
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [{ loader: MiniCssExtractPlugin.loader }, { loader: 'css-loader' }],
            },
        ],
    },
    devServer: { port: 3001 },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
        }),
        new ForkTsCheckerWebpackPlugin(),
        new MiniCssExtractPlugin({ filename: 'styles.css' }),
    ],
};

import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ZipPlugin from 'zip-webpack-plugin';
import webpack from 'webpack';

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/',
        filename: '[name].js',
    },
    target: 'web',
    mode: 'development',

    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',

    devServer: {
        port: 8888,
        contentBase: './build',
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.mustache', '.html', '.json', '.css', '.scss'],
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: ['ts-loader'],
            },
            {
                test: /\.(css|scss)$/i,
                use: [
                    'style-loader',
                    {
                        loader: '@teamsupercell/typings-for-css-modules-loader',
                        options: {
                            banner:
                                '// autogenerated by typings-for-css-modules-loader. \n// Please do not change this file!',
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: { modules: true },
                    },
                ],
                include: [/\.module\.css$/, /\.module\.scss$/],
            },
            {
                test: /\.(css|scss)$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
                exclude: [/\.module\.css$/, /\.module\.scss$/],
            },
        ],
    },
    plugins: [
        new webpack.WatchIgnorePlugin([/(css|scss)\.d\.ts$/]),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html'),
        }),
        new ZipPlugin({
            // OPTIONAL: defaults to the Webpack output filename (above) or,
            // if not present, the basename of the path
            filename: 'locabnb.zip',
        }),
    ],
};

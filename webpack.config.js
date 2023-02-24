const path = require('path')

const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require("clean-webpack-plugin")

const production = process.env.NODE_ENV === 'production'

const MODULE_NAME = 'app'
const distDirectory = path.join(__dirname, `/dist`)

module.exports = {
    target: production ? ['web', 'es5'] : 'web',

    entry: path.resolve(__dirname, './app.js'),

    ...production ? {} : {devtool: 'inline-source-map'},

    output: {
        path: distDirectory,
        filename: `${MODULE_NAME}-[name]-[contenthash].min.js`
    },

    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: ['html-loader']
            },
            {
                test: /\.scss|css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '/'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: {
                                filter: url => !url.startsWith('/')
                            }
                        }
                    },
                    'postcss-loader'
                ]
            },
        ]
    },

    devServer: {
        static: {directory: distDirectory},
        watchFiles: ["*.html"],
        compress: true,
        port: 9000,
    },

    optimization: {
        nodeEnv: production ? 'production' : 'development',
        minimize: production,
        ...production ? {
            mangleExports: 'size',
            minimizer: [
                new TerserPlugin({
                    test: /\.js?$/,
                    extractComments: true
                }),
                new CssMinimizerPlugin({
                    test: /\.scss|css$/,
                    minimizerOptions: {
                        preset: require.resolve('cssnano-preset-default'),
                    },
                })
            ]
        } : {},
    },

    performance: {
        hints: false,
    },

    plugins: [

        //extract all css per entry to one distiled file
        new MiniCssExtractPlugin({
            filename: `${MODULE_NAME}-[name]-[contenthash].min.css`,
            chunkFilename: "[name].css"
        }),

        // create HTML file connected to generated JS
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'index.html'),
            filename: 'index.html'
        }),

        //clear dist folder before building
        new CleanWebpackPlugin()
    ]
}
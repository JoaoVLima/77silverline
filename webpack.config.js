const path = require('path')
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const commonConfig = {
    entry: {
        index: "./src/index.ts",
    },
    module: {
        rules: [
            {
                test: /\.html/,
                type: 'asset/resource',
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
};

const developmentConfig = {
    mode: "development",
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
        hot: true,
    },
};

const productionConfig = {
    mode: "production",
    output: {
        filename: "[name].[contentHash].bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    performance: {
        hints: false,
    },
};

module.exports = (env, args) => {
    switch(args.mode) {
        case 'development':
            return merge(commonConfig, developmentConfig);
        case 'production':
            return merge(commonConfig, productionConfig);
        default:
            throw new Error('No matching configuration was found!');
    }
}
const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
  // const env = dotenv.config().parsed;
   return {
    mode: 'production',
    entry: './src/index.js',
    output: {
      path: path.join(__dirname, 'dist'),
      publicPath: '/',
      filename: 'main.js',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ],
    },
    devtool: "eval-source-map",
    experiments: {
      topLevelAwait: true,
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      port: 3000,
      allowedHosts: ['.gitpod.io']
    },
    resolve: {
      extensions: ['.jsx', '.js', '.json'],
      alias: {
        http: 'stream-http',
        https: 'https-browserify',
        stream: "stream-browserify",
        crypto: "crypto-browserify",
        path: "path-browserify"
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
      new Dotenv(),
      // new webpack.DefinePlugin({
      //   'process.env': JSON.stringify(env)
      // }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  };
};

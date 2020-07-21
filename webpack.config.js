const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ChunksWebpackPlugin = require("chunks-webpack-plugin");
const BrotliPlugin = require('brotli-webpack-plugin');

const outputDirectory = 'dist';

module.exports = {
  mode: 'production',
  devtool: false,
  entry: ['babel-polyfill', './src/client/index.js'],
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: "static/[name].[hash].js",
    chunkFilename: '[name].bundle.js',
    publicPath: '/'
  },
  optimization: {
    moduleIds: "hashed",
    runtimeChunk: {
      name: "manifest",
    },    
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          minChunks: 2,
          name: "vendor",
          chunks: "all",
          minSize: 10000,
          maxSize: 244000,
        },
        common: {
          test: /[\\/]src[\\/]components[\\/]/,
          chunks: "all",
          minSize: 0,
        },
      },
      minSize: 10000,
      maxSize: 250000,
    }
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    },
    {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader']
    },
    {
      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      loader: 'url-loader?limit=100000'
    }
    ]
  },
  devServer: {
    port: 3000,
    open: true,
    proxy: {
      '/api': 'http://localhost:8080'
    },
    historyApiFallback: true,
    contentBase: './',
    hot: true
  },
  plugins: [
    new ChunksWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "styles/[name].[hash].css",
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new Dotenv({ path: './.env' }),
    new webpack.DefinePlugin({
      'process.env': {
        'REACT_APP_GOOGLE_API_KEY': JSON.stringify(process.env.REACT_APP_GOOGLE_API_KEY),
        'REACT_APP_ADMIN_EMAIL': JSON.stringify(process.env.REACT_APP_ADMIN_EMAIL),
      }
    }),
    new BrotliPlugin({
      asset: '[path].br[query]',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    webpack.optimize.ModuleConcatenationPlugin()
  ],
  performance: {
    hints: "warning", // enum
    maxAssetSize: 200000, // int (in bytes),
    maxEntrypointSize: 200000, // int (in bytes)
  }
};

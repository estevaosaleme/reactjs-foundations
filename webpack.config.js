const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
module.exports = {
  // webpack will take the files from ./src/index
  entry: path.resolve(__dirname, 'src', 'index.tsx'),
  // and output it into /dist as bundle.js
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
  },
  // adding .ts and .tsx to resolve.extensions will help babel look for .ts and .tsx files to transpile
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      // we use babel-loader to load our jsx and tsx files
    {
      test: /\.(ts|js)x?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      },
    },
    // css-loader to bundle all the css files into one file and style-loader to add all the styles  inside the style tag of the document
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
      exclude: /node_modules/,
      use: ['file-loader?name=[name].[ext]'] // ?name=[name].[ext] is only necessary to preserve the original file name
    }
  ]
},
devServer: {
  historyApiFallback: true,
  host: '0.0.0.0',
  port: 3330,
  public: 'http://0.0.0.0:' + process.env.PUBLIC_PORT,
  disableHostCheck: true,
},
plugins: [
  new HtmlWebpackPlugin({
    template: './public/index.html'
  }),
  new Dotenv({
    allowEmptyValues: true,
    systemvars: true
  })
 ]
};
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true //HMR doesn't work without this
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  plugins: [new HtmlWebpackPlugin(), new ForkTsCheckerWebpackPlugin()],
  devServer: {
    contentBase: path.resolve('public')
  }
};

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/admin/index.tsx',
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
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Eth Plot Admin Page'
    }),
    new ForkTsCheckerWebpackPlugin()
  ],
  devServer: {
    contentBase: path.resolve('../public')
  },
  performance: { hints: false }
};

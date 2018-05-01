const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');

// Truffle Addresses
// const contractAddress = '0x345ca3e014aaf5dca488057592ee47305d9b3e10';
// const web3Provider = 'http://localhost:9545';

// Ganache Addresses
// const contractAddress = '0xcfeb869f69431e42cdb54a4f4f105c19c080a601';
// const web3Provider = 'http://localhost:8545';

const contractAddress = process.env.CONTRACT_ADDRESS || '0xcfeb869f69431e42cdb54a4f4f105c19c080a601';
const web3Provider = process.env.WEB3_PROVIDER || 'http://localhost:8545';

// Send down some info about what configuration we want to use for web3
const web3Config = { contractAddress, web3Provider };

console.log(`Starting dev server with ${JSON.stringify(web3Config)}`);

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
  plugins: [new HtmlWebpackPlugin({title: 'Aion Grid'}), new ForkTsCheckerWebpackPlugin()],
  devServer: {
    contentBase: path.resolve('public'),
    headers: { 
      "Set-Cookie": `web3Config=${JSON.stringify(web3Config)};`
    }
  }
};

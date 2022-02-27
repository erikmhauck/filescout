const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const isDevelop = process.env.NODE_ENV === 'dev';

module.exports = {
  name: 'client',
  entry: {
    client: path.resolve(__dirname, 'src', 'client', 'client.tsx'),
  },
  mode: isDevelop ? 'development' : 'production',
  output: {
    path: path.resolve(__dirname + '/dist/static'),
    filename: '[name].[contenthash].js',
    publicPath: '',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.client.json',
        },
      },
      {
        test: /\.(sass|css|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  target: 'web',
  plugins: [new CleanWebpackPlugin(), new WebpackManifestPlugin()],
};

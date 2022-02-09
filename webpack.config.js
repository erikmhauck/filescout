const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isDevelop = true;

const mode = isDevelop ? "development" : "production";

const serverConfig = {
  name: 'server',
  target: "node",
  entry: "./server.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "server.js",
  },
  devtool: "inline-source-map",
  mode: mode,
};

const clientConfig = {
  name: 'client',
  target: "web",
  entry: "./client/src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "client.js",
    publicPath: "/",
  },
  devServer: {
    static: "./dist",
  },
  devtool: "inline-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      title: "filescout",
    }),
  ],
  mode: mode,
};

module.exports = [serverConfig, clientConfig];

import * as extend from "extend";
import * as path from "path";
import * as webpack from "webpack";
import * as nodeExternals from "webpack-node-externals";

const DEBUG = !(process.argv.indexOf("--release") !== -1);
const VERBOSE = (process.argv.indexOf("--verbose") !== -1);

const serverConfig: webpack.Configuration = {
  entry: "./src/server.ts",

  cache: DEBUG,

  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
  },

  target: "node",
  externals: [nodeExternals()],

  module: {
    rules: [
      {
        test: /\.pug?$/,
        use: "pug-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/,
        use: "ts-loader?configFile=../tsconfig.json",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ ".tsx", ".ts", ".js" ],
  },
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "../build"),
  },
};

export default [serverConfig];

import * as extend from "extend";
import * as path from "path";
import * as webpack from "webpack";
import * as nodeExternals from "webpack-node-externals";

const DEBUG = !(process.argv.indexOf("--release") !== -1);
const VERBOSE = (process.argv.indexOf("--verbose") !== -1);

const serverConfig: webpack.Configuration = {
  entry: "./src/server.ts",
  output: {
    filename: "server.js",
    publicPath: "/",
    path: path.resolve(__dirname, "../build"),
  },

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
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
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
        use: "ts-loader?configFile=../src/tsconfig.json",
        exclude: [ /node_modules/, /public/ ],
      },
    ],
  },
  resolve: {
    extensions: [ "ts", ".js" ],
  },
};

const clientConfig: webpack.Configuration = {
  entry: "./src/public/App.tsx",
  output: {
    filename: "client.js",
    path: path.resolve(__dirname, "../build/public"),
  },

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

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: path.resolve(__dirname, "..", "src/public/tsconfig.json"),
          },
        },
        exclude: [ /node_modules/ ],
      },
    ],
  },
  resolve: {
    extensions: [ ".tsx", ".ts", ".js" ],
  },

  // externals: {
  //   "react": "React",
  //   "react-dom": "ReactDOM",
  // },
};

export default [serverConfig, clientConfig];

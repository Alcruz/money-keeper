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
        test: /\.ts$/,
        use: "ts-loader?configFile=../src/tsconfig.json",
        exclude: [ /node_modules/, /public/ ],
      },
      {
        test: /\.pug?$/,
        use: "pug-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ "ts", ".js" ],
  },
};

const clientConfig: webpack.Configuration = {
  entry: [
    "./src/public/index.tsx",
  ],
  output: {
    filename: "client.js",
    publicPath: "/",
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
        use: [{
          loader: "ts-loader",
          options: {
            configFile: path.resolve(__dirname, "..", "src/public/tsconfig.json"),
          },
        }],
        exclude: [ /node_modules/ ],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader" },
          { loader: "typings-for-css-modules-loader",
            options: {
              modules: true,
              importLoaders: 1,
              namedExport: true,
              camelCase: true,
              sourceMap: true,
              localIdentName: DEBUG ? "[name]_[local]" : "[hash:base64:5]",
            },
          },
          { loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [ ".tsx", ".ts", ".js" ],
  },
  plugins: [
    new webpack.WatchIgnorePlugin([
      /scss\.d\.ts$/,
    ]),
  ],
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
  },
};

export { serverConfig, clientConfig };

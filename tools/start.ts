import * as Browsersync from "browser-sync";
import * as path from "path";
import * as webpack from "webpack";
import * as webpackHotMiddleware from "webpack-hot-middleware";
import * as webpackDevMiddleware from "webpack-middleware";

import bundle from "./bundle";
import clean from "./clean";
import run from "./run";
import runServer from "./runServer";
import { clientConfig, serverConfig } from "./webpack.config";

const DEBUG = !(process.argv.indexOf("--release") !== -1);

async function start() {
    await run(clean);
    await new Promise((resolve) => {
        const devClientConf = Object.assign(
            clientConfig,
            {
                entry: [
                    "react-hot-loader/patch",
                    "webpack-hot-middleware/client",
                    ...(clientConfig.entry as string[]) 
                ],
                module: {
                    rules: [
                        {
                            test: /\.tsx?$/,
                            use: [
                                {
                                    loader: "react-hot-loader/webpack",
                                },
                                {
                                    loader: "ts-loader",
                                    options: {
                                        configFile: path.resolve(__dirname, "..", "src/public/tsconfig.json"),
                                    },
                                },
                            ],
                            exclude: [ /node_modules/ ],
                        },
                        ...(clientConfig.module as webpack.NewModule).rules.slice(1)
                    ]
                },
                plugins: [],
            },
        );

        devClientConf.plugins.push(new webpack.HotModuleReplacementPlugin());
        devClientConf.plugins.push(new webpack.NoEmitOnErrorsPlugin());

        const bundler = webpack([devClientConf, serverConfig]) as any;
        const wpMiddleware = webpackDevMiddleware(bundler, {
            publicPath: serverConfig.output.publicPath,
            stats: serverConfig.stats,
        });

        const hotMiddlewares = (bundler as any)
        .compilers
        .filter((compiler) => compiler.options.target !== "node")
        .map((compiler) => webpackHotMiddleware(compiler));

        let bs;
        bundler.plugin("done", () => {
            if (bs === undefined) {
                runServer((err, host) => {
                    if (!err) {
                        bs = Browsersync.create();
                        bs.init({
                            ...(DEBUG ? {} : { notify: false, ui: false }),
                            proxy: {
                                target: host,
                                middleware: [wpMiddleware, ...hotMiddlewares],
                            },
                        }, resolve);
                    }
                });
            } else {
                runServer();
            }
        });
    });
}

export default start;

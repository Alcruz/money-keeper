import * as webpack from "webpack";
import { clientConfig, serverConfig } from "./webpack.config";
/**
 * Creates application bundles from the source files.
 */
function bundle() {
  return new Promise((resolve, reject) => {
    webpack([serverConfig, clientConfig]).run((err, stats) => {
      if (err) {
        return reject(err);
      }

      console.log(stats.toString(serverConfig.stats));
      return resolve();
    });
  });
}

export default bundle;

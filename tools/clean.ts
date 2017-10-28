import * as del from "del";
import fs from "./fs";

/**
 * Cleans up the output (build) directory.
 */
async function clean() {
  await del([".tmp", "build/*", "!build/.git"], { dot: true });
  await fs.makeDir("build/public");
}

export default clean;

import { readdir } from "fs/promises";
import { join, isAbsolute } from "path";
import Log from "./Log.js";
import Helpers from "./Helpers.js";

class Nwd {
  constructor() {
    this.log = new Log();
  }

  up() {
    process.chdir("../");
  }

  async cd(dir) {
    const pathToDir = isAbsolute ? dir : join(process.cwd(), dir);
    const statFile = await Helpers.getStatFile(pathToDir);

    if (statFile.stat) {
      process.chdir(pathToDir);
    } else {
      this.log.log(
        `${Helpers.messages.operationFailed}\n${statFile.error}`,
        "red"
      );
    }
  }

  async ls() {
    const fileSystemElements = {
      directory: [],
      file: [],
      unknown: [],
    };

    const files = await readdir(process.cwd());

    try {
      for (const name of files) {
        let type = null;
        const statFile = await Helpers.getStatFile(name);

        if (!statFile.stat) {
          throw new Error(statFile.error);
        }

        if (statFile.stat.isDirectory()) {
          type = "directory";
        } else if (statFile.stat.isFile()) {
          type = "file";
        } else {
          type = "unknown";
        }

        fileSystemElements[type].push({ name, type });
      }

      const output = Object.values(fileSystemElements).flat(1);
      console.table(output);
    } catch (error) {
      this.log.log(
        `${Helpers.messages.operationFailed}\n${error.message}`,
        "red"
      );
    }
  }
}

export default Nwd;

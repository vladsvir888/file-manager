import { readdir } from "fs/promises";
import { join } from "path";
import Log from "./Log.js";
import Helpers from "./Helpers.js";

class Nwd {
  constructor() {
    this.log = new Log();
  }

  up() {
    process.chdir(join("../"));
  }

  async cd(dir) {
    try {
      const pathToDir = Helpers.getPath(dir);
      process.chdir(pathToDir);
    } catch (error) {
      this.log.log(
        `${Helpers.messages.operationFailed} ${error.message}`,
        "red"
      );
    }
  }

  async ls() {
    const fileSystemElements = {
      directory: [],
      file: [],
    };

    const files = await readdir(process.cwd());

    if (!files.length) {
      return;
    }

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
        }

        if (type !== null) {
          fileSystemElements[type].push({ name, type });
        }
      }

      for (const key in fileSystemElements) {
        fileSystemElements[key].sort((a, b) => a.name.localeCompare(b.name));
      }

      const output = Object.values(fileSystemElements).flat(1);
      console.table(output);
    } catch (error) {
      this.log.log(
        `${Helpers.messages.operationFailed} ${error.message}`,
        "red"
      );
    }
  }
}

export default Nwd;

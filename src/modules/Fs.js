import { createReadStream, createWriteStream } from "fs";
import { writeFile, rm, rename } from "fs/promises";
import { isAbsolute, join, basename, dirname } from "path";
import { pipeline } from "stream/promises";
import Helpers from "./Helpers.js";
import Log from "./Log.js";

class Fs {
  constructor() {
    this.log = new Log();
  }

  async readAndPrintContent(file, cb) {
    const pathToFile = Helpers.getPath(file);
    const rstream = createReadStream(pathToFile, { encoding: "utf-8" });

    rstream.on("data", (chunk) => process.stdout.write(`${chunk}\n`));
    rstream.on("end", cb);
    rstream.on("error", (error) =>
      this.log.log(
        `${Helpers.messages.operationFailed} ${error.message}`,
        "red"
      )
    );
  }

  async createFile(fileName) {
    if (isAbsolute(fileName) && process.cwd() !== join(dirname(fileName))) {
      this.log.log(
        `${Helpers.messages.operationFailed} ${Helpers.messages.createFileOnlyInCurrDir}`,
        "red"
      );
      return;
    }

    try {
      const pathToFile = Helpers.getPath(fileName);

      await writeFile(pathToFile, "", { flag: "wx" });
    } catch (error) {
      this.log.log(
        `${Helpers.messages.operationFailed} ${error.message}`,
        "red"
      );
    }
  }

  async renameFile(oldFile, newFile) {
    try {
      const pathToOldFile = Helpers.getPath(oldFile);
      const pathToNewFile = Helpers.getPath(newFile);

      await rename(pathToOldFile, pathToNewFile);
    } catch (error) {
      this.log.log(
        `${Helpers.messages.operationFailed} ${error.message}`,
        "red"
      );
    }
  }

  async copyFile(oldPath, newPath) {
    try {
      const pathToFile = Helpers.getPath(oldPath);
      const pathToDir = Helpers.getPath(newPath);
      const newFilePath = join(pathToDir, basename(pathToFile));

      const statFile = await Helpers.getStatFile(newFilePath);

      if (statFile.stat) {
        throw new Error(Helpers.messages.alreadyExists(newFilePath));
      }

      const rstream = createReadStream(pathToFile);
      const wstream = createWriteStream(newFilePath);

      await pipeline(rstream, wstream);

      return true;
    } catch (error) {
      this.log.log(
        `${Helpers.messages.operationFailed} ${error.message}`,
        "red"
      );

      return false;
    }
  }

  async moveFile(oldPath, newPath) {
    const copyResult = await this.copyFile(oldPath, newPath);

    if (copyResult) {
      await this.deleteFile(oldPath);
    }
  }

  async deleteFile(file) {
    try {
      const pathToFile = Helpers.getPath(file);

      await rm(pathToFile);
    } catch (error) {
      this.log.log(
        `${Helpers.messages.operationFailed} ${error.message}`,
        "red"
      );
    }
  }
}

export default Fs;

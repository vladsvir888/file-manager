import { createReadStream, createWriteStream } from "fs";
import { writeFile, rm, rename } from "fs/promises";
import { isAbsolute, join, basename, dirname } from "path";
import { pipeline } from "stream/promises";
import Helpers from "./Helpers";
import Log from "./Log";

class Fs {
  private log: Log;

  constructor() {
    this.log = new Log();
  }

  public async readAndPrintContent(
    file: string,
    cb: () => void
  ): Promise<void> {
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

  public async createFile(fileName: string): Promise<void> {
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
      if (error instanceof Error) {
        this.log.log(
          `${Helpers.messages.operationFailed} ${error.message}`,
          "red"
        );
      }
    }
  }

  public async renameFile(oldFile: string, newFile: string): Promise<void> {
    try {
      const pathToOldFile = Helpers.getPath(oldFile);
      const pathToNewFile = Helpers.getPath(newFile);

      await rename(pathToOldFile, pathToNewFile);
    } catch (error) {
      if (error instanceof Error) {
        this.log.log(
          `${Helpers.messages.operationFailed} ${error.message}`,
          "red"
        );
      }
    }
  }

  public async copyFile(oldPath: string, newPath: string): Promise<boolean> {
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
      if (error instanceof Error) {
        this.log.log(
          `${Helpers.messages.operationFailed} ${error.message}`,
          "red"
        );
      }

      return false;
    }
  }

  public async moveFile(oldPath: string, newPath: string): Promise<void> {
    const copyResult = await this.copyFile(oldPath, newPath);

    if (copyResult) {
      await this.deleteFile(oldPath);
    }
  }

  public async deleteFile(file: string): Promise<void> {
    try {
      const pathToFile = Helpers.getPath(file);

      await rm(pathToFile);
    } catch (error) {
      if (error instanceof Error) {
        this.log.log(
          `${Helpers.messages.operationFailed} ${error.message}`,
          "red"
        );
      }
    }
  }
}

export default Fs;

import { readdir } from "fs/promises";
import { join } from "path";
import Log from "./Log";
import Helpers from "./Helpers";

class Nwd {
  private log: Log;

  constructor() {
    this.log = new Log();
  }

  public up() {
    try {
      process.chdir(join("../"));
    } catch {
      this.log.log(
        `${Helpers.messages.operationFailed} ${Helpers.messages.errorChangeDir}`,
        "red"
      );
    }
  }

  public async cd(dir: string): Promise<void> {
    try {
      const pathToDir = Helpers.getPath(dir);
      process.chdir(pathToDir);
    } catch (error) {
      if (error instanceof Error) {
        this.log.log(
          `${Helpers.messages.operationFailed} ${error.message}`,
          "red"
        );
      }
    }
  }

  public async ls(): Promise<void> {
    type FileSystemElement = {
      type: keyof typeof fileSystemElements;
      name: string;
    };

    const fileSystemElements = {
      directory: [],
      file: [],
    } as {
      directory: FileSystemElement[];
      file: FileSystemElement[];
    };

    const files = await readdir(process.cwd());

    if (!files.length) {
      return;
    }

    try {
      for (const name of files) {
        let type: FileSystemElement["type"] | undefined;
        const statFile = await Helpers.getStatFile(name);

        if (!statFile.stat) {
          throw new Error(statFile.error);
        }

        if (statFile.stat.isDirectory()) {
          type = "directory";
        } else if (statFile.stat.isFile()) {
          type = "file";
        }

        if (type) {
          fileSystemElements[type].push({ name, type });
        }
      }

      for (const key in fileSystemElements) {
        const innerKey = key as FileSystemElement["type"];
        fileSystemElements[innerKey].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      }

      const output = Object.values(fileSystemElements).flat(1);
      console.table(output);
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

export default Nwd;

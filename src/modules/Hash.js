import { createHash } from "crypto";
import { readFile } from "fs/promises";
import { join, isAbsolute } from "path";
import Log from "./Log.js";
import Helpers from "./Helpers.js";

class Hash {
  constructor() {
    this.log = new Log();
  }

  calcHash(content) {
    return createHash("sha256").update(content).digest("hex");
  }

  async printHash(file) {
    const pathToFile = isAbsolute ? file : join(process.cwd(), file);
    const statFile = await Helpers.getStatFile(pathToFile);

    if (!statFile.stat) {
      this.log.log(`${Helpers.messages.failed}\n${statFile.error}`, "red");
      return;
    }

    try {
      const content = await readFile(pathToFile);
      const result = this.calcHash(content);
      console.log(`Hash for file: ${result}`);
    } catch (error) {
      this.log.log(`${Helpers.messages.failed}\n${error.message}`, "red");
    }
  }
}

export default Hash;

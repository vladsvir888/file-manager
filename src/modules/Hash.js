import { createHash } from "crypto";
import { readFile } from "fs/promises";
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
    try {
      const pathToFile = Helpers.getPath(file);
      const content = await readFile(pathToFile);
      const result = this.calcHash(content);
      console.log(`Hash for file: ${result}`);
    } catch (error) {
      this.log.log(
        `${Helpers.messages.operationFailed} ${error.message}`,
        "red"
      );
    }
  }
}

export default Hash;

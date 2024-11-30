import { createHash } from "crypto";
import { readFile } from "fs/promises";
import Log from "./Log";
import Helpers from "./Helpers";

class Hash {
  private log: Log;

  constructor() {
    this.log = new Log();
  }

  private calcHash(content: string): string {
    return createHash("sha256").update(content).digest("hex");
  }

  public async printHash(file: string): Promise<void> {
    try {
      const pathToFile = Helpers.getPath(file);
      const content = await readFile(pathToFile, { encoding: "utf-8" });
      const result = this.calcHash(content);
      this.log.log(`Hash for file: ${result}`);
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

export default Hash;

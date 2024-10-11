import { createBrotliCompress, createBrotliDecompress } from "zlib";
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { join, basename } from "path";
import Helpers from "./Helpers.js";
import Log from "./Log.js";

class Zip {
  #operations = {
    comp: "compress",
    decomp: "decompress",
  };

  constructor() {
    this.log = new Log();
  }

  async #execute(operation, src, dest) {
    try {
      const pathToSrc = Helpers.getPath(src);
      const pathToDest = Helpers.getPath(dest);

      const isCurrentDirDest = dest === ".";
      let preparedPathToDest;

      if (operation === this.#operations.comp) {
        preparedPathToDest = isCurrentDirDest
          ? join(pathToDest, `${basename(pathToSrc)}.br`)
          : pathToDest;
      } else {
        preparedPathToDest = isCurrentDirDest
          ? join(pathToDest, `${basename(pathToSrc).replace(".br", "")}`)
          : pathToDest;
      }

      const rstream = createReadStream(pathToSrc);
      const wstream = createWriteStream(preparedPathToDest);

      const compressOrDecompress =
        operation === this.#operations.comp
          ? createBrotliCompress
          : createBrotliDecompress;

      await pipeline(rstream, compressOrDecompress(), wstream);
    } catch (error) {
      this.log.log(
        `${Helpers.messages.operationFailed} ${error.message}`,
        "red"
      );
    }
  }

  async compress(src, dest) {
    this.#execute(this.#operations.comp, src, dest);
  }

  async decompress(src, dest) {
    this.#execute(this.#operations.decomp, src, dest);
  }
}

export default Zip;

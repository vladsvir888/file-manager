import { createBrotliCompress, createBrotliDecompress } from "zlib";
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { join, basename } from "path";
import Helpers from "./Helpers";
import Log from "./Log";

class Zip {
  private log: Log;
  private operations = {
    compress: "compress",
    decompress: "decompress",
  } as const;

  constructor() {
    this.log = new Log();
  }

  private async execute(
    operation: keyof typeof this.operations,
    src: string,
    dest: string
  ): Promise<void> {
    try {
      const pathToSrc = Helpers.getPath(src);
      const pathToDest = Helpers.getPath(dest);

      const isCurrentDirDest = dest === ".";
      let preparedPathToDest: string | undefined;

      if (operation === this.operations.compress) {
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
        operation === this.operations.compress
          ? createBrotliCompress
          : createBrotliDecompress;

      await pipeline(rstream, compressOrDecompress(), wstream);
    } catch (error) {
      if (error instanceof Error) {
        this.log.log(
          `${Helpers.messages.operationFailed} ${error.message}`,
          "red"
        );
      }
    }
  }

  public async compress(src: string, dest: string): Promise<void> {
    this.execute(this.operations.compress, src, dest);
  }

  public async decompress(src: string, dest: string): Promise<void> {
    this.execute(this.operations.decompress, src, dest);
  }
}

export default Zip;

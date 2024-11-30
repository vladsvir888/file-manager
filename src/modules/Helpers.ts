import { Stats } from "fs";
import { lstat } from "fs/promises";
import { isAbsolute, join } from "path";

const Helpers = {
  async getStatFile(path: string): Promise<{
    stat: Stats | undefined;
    error: string | undefined;
  }> {
    try {
      const stat = await lstat(path);
      return {
        stat,
        error: undefined,
      };
    } catch (error) {
      return {
        stat: undefined,
        error: error instanceof Error ? error.message : undefined,
      };
    }
  },

  removeQuotes(arrPath: string[]): string[] {
    return arrPath.map((path) => path.replace(/^['"]|['"]$/g, ""));
  },

  getPath(path: string): string {
    return isAbsolute(path) ? join(path) : join(process.cwd(), path);
  },

  messages: {
    operationFailed: "Operation failed.",
    invalidInput: "Invalid input.",
    incorrectUsername:
      'You probably entered the option "--username" incorrectly. The default username is stranger.',
    unknownCommand: (command: string): string =>
      `Unknown command "${command}".`,
    nothingEntered: "You have not entered anything.",
    wrongOption: (option: string): string => `Wrong option "${option}".`,
    createFileOnlyInCurrDir:
      "You can create a file only in the current directory.",
    alreadyExists: (path: string): string => `${path} already exists.`,
    errorChangeDir: "Error while changing directory.",
  },
};

export default Helpers;

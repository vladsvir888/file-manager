import { lstat } from "fs/promises";
import { isAbsolute, join } from "path";

const Helpers = {
  async getStatFile(path) {
    try {
      const stat = await lstat(path);
      return {
        stat,
        error: null,
      };
    } catch (error) {
      return {
        stat: null,
        error: error.message,
      };
    }
  },

  removeQuotes(arrPath) {
    return arrPath.map((path) => path.replace(/^['"]|['"]$/g, ""));
  },

  getPath(path) {
    return isAbsolute(path) ? join(path) : join(process.cwd(), path);
  },

  messages: {
    operationFailed: "Operation failed.",
    invalidInput: "Invalid input.",
    incorrectUsername:
      'You probably entered the option "--username" incorrectly. The default username is stranger.',
    unknownCommand: (command) => `Unknown command "${command}".`,
    nothingEntered: "You have not entered anything.",
    wrongOption: (option) => `Wrong option "${option}".`,
    createFileOnlyInCurrDir:
      "You can create a file only in the current directory.",
    alreadyExists: (path) => `${path} already exists.`,
  },
};

export default Helpers;

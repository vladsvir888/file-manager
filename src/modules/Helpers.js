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

  replaceAndTrim(input) {
    return input.replace(/(hash|os|cd|compress|decompress)/, "").trim();
  },

  getPath(path) {
    return isAbsolute(path) ? join(path) : join(process.cwd(), path);
  },

  messages: {
    operationFailed: "Operation failed.",
    invalidInput: "Invalid input.",
    incorrectUsername() {
      return `${this.invalidInput} You probably entered the option "--username" incorrectly. The default username is Stranger.`;
    },
    unknownCommand: (command) => `Unknown command "${command}".`,
    nothingEntered: "You have not entered anything.",
    wrongOption: (option) => `Wrong option "${option}".`,
  },
};

export default Helpers;

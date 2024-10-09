import { lstat } from "fs/promises";

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

  messages: {
    operationFailed: "Operation failed.",
    invalidInput: "Invalid input.",
    incorrectUsername() {
      return `${this.invalidInput} You probably entered the option "--username" incorrectly. The default username is Stranger.`;
    },
  },
};

export default Helpers;

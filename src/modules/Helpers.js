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
    failed: "Operation failed",
  },
};

export default Helpers;

import os from "os";
import Log from "./Log.js";
import Helpers from "./Helpers.js";

class Os {
  #options = {
    eol: "--EOL",
    cpus: "--cpus",
    homedir: "--homedir",
    username: "--username",
    architecture: "--architecture",
  };

  constructor() {
    this.log = new Log();
  }

  checkOption(option) {
    switch (option) {
      case this.#options.eol:
        this.printEOL();
        break;
      case this.#options.cpus:
        this.printCPUsInfo();
        break;
      case this.#options.homedir:
        this.printHomedir();
        break;
      case this.#options.username:
        this.printSystemUsername();
        break;
      case this.#options.architecture:
        this.printCPUArch();
        break;
      default:
        this.log.log(
          `${Helpers.messages.invalidInput} ${Helpers.messages.wrongOption(
            option
          )}`,
          "red"
        );
        break;
    }
  }

  printEOL() {
    console.log(`Default system End-Of-Line: ${JSON.stringify(os.EOL)}`);
  }

  printCPUsInfo() {
    const cpus = os.cpus();
    const cpusInfo = cpus
      .map((cpu, index) => {
        const clockRate = cpu.model.match(/\d+\.\d+GHz/g);
        return `CPU ${index + 1}. Model: ${cpu.model}. Clock rate: ${
          clockRate[0]
        }`;
      })
      .join("\n");
    console.log(`Overall amount of CPUs: ${cpus.length}\n${cpusInfo}`);
  }

  printHomedir() {
    console.log(`Home directory: ${os.homedir()}`);
  }

  printSystemUsername() {
    console.log(`System user name: ${os.userInfo().username}`);
  }

  printCPUArch() {
    console.log(`CPU architecture: ${os.arch()}`);
  }
}

export default Os;

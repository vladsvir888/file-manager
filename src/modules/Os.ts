import os from "os";
import Log from "./Log";
import Helpers from "./Helpers";

class Os {
  private log: Log;
  private options = {
    eol: "--EOL",
    cpus: "--cpus",
    homedir: "--homedir",
    username: "--username",
    architecture: "--architecture",
  };

  constructor() {
    this.log = new Log();
  }

  public checkOption(option: string): void {
    switch (option) {
      case this.options.eol:
        this.printEOL();
        break;
      case this.options.cpus:
        this.printCPUsInfo();
        break;
      case this.options.homedir:
        this.printHomedir();
        break;
      case this.options.username:
        this.printSystemUsername();
        break;
      case this.options.architecture:
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

  private printEOL(): void {
    this.log.log(`Default system End-Of-Line: ${JSON.stringify(os.EOL)}`);
  }

  private printCPUsInfo(): void {
    const cpus = os.cpus();
    const cpusInfo = cpus
      .map((cpu, index) => {
        const clockRate = cpu.model.match(/\d+\.\d+GHz/g) || [];
        return `CPU ${index + 1}. Model: ${cpu.model}. Clock rate: ${
          clockRate[0] || "Unknown"
        }`;
      })
      .join("\n");
    this.log.log(`Overall amount of CPUs: ${cpus.length}\n${cpusInfo}`);
  }

  private printHomedir(): void {
    this.log.log(`Home directory: ${os.homedir()}`);
  }

  private printSystemUsername(): void {
    this.log.log(`System user name: ${os.userInfo().username}`);
  }

  private printCPUArch(): void {
    this.log.log(`CPU architecture: ${os.arch()}`);
  }
}

export default Os;

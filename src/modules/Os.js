import os from "os";

class Os {
  options = {
    eol: "--EOL",
    cpus: "--cpus",
    homedir: "--homedir",
    username: "--username",
    architecture: "--architecture",
  };

  checkOption(option) {
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
        return `CPU ${index + 1}. Model: ${cpu.model}. Clock rate: ${(
          cpu.speed / 1000
        ).toFixed(2)} GHz`;
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

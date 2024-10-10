import os from "os";
import readline from "readline/promises";
import Os from "./modules/Os.js";
import Log from "./modules/Log.js";
import Nwd from "./modules/Nwd.js";
import Hash from "./modules/Hash.js";
import Helpers from "./modules/Helpers.js";

class App {
  commands = {
    exit: ".exit",
    os: "os",
    up: "up",
    cd: "cd",
    ls: "ls",
    hash: "hash",
  };

  constructor() {
    this.init();
  }

  handleExit() {
    this.sayGoodbye();
    process.exit();
  }

  sayHello() {
    this.modules.log.log(`Welcome to the File Manager, ${this.user}!`);
  }

  sayGoodbye() {
    this.modules.log.log(
      `Thank you for using File Manager, ${this.user}, goodbye!`
    );
  }

  printCurrentWorkingDir() {
    this.modules.log.log(`You are currently in ${process.cwd()}`, "cyan");
  }

  getUsername() {
    const user = process.argv.find((arg) => /^--username=\S+$/.test(arg));

    if (!user) {
      this.modules.log.log(`${Helpers.messages.incorrectUsername()}`, "red");
      return "Stranger";
    }

    return user.replace("--username=", "");
  }

  async checkCommand(input) {
    const command = input.match(/^[.a-z]+/g)?.[0];

    switch (command) {
      case this.commands.exit:
        this.handleExit();
        break;
      case this.commands.up:
        this.modules.nwd.up();
        break;
      case this.commands.cd:
        const dir = input.replace("cd ", "").trim();
        await this.modules.nwd.cd(dir);
        break;
      case this.commands.ls:
        await this.modules.nwd.ls();
        break;
      case this.commands.os:
        const option = input.replace("os ", "").trim();
        this.modules.os.checkOption(option);
        break;
      case this.commands.hash:
        const file = input.replace("hash ", "").trim();
        await this.modules.hash.printHash(file);
        break;
      default:
        if (!command) {
          this.modules.log.log(
            `${Helpers.messages.invalidInput} ${Helpers.messages.nothingEntered}`,
            "red"
          );
        } else {
          this.modules.log.log(
            `${Helpers.messages.invalidInput} ${Helpers.messages.unknownCommand(
              command
            )}`,
            "red"
          );
        }
        break;
    }

    this.printCurrentWorkingDir();
  }

  init() {
    this.modules = {
      os: new Os(),
      log: new Log(),
      nwd: new Nwd(),
      hash: new Hash(),
    };

    this.user = this.getUsername();

    process.chdir(os.homedir());

    this.sayHello();
    this.printCurrentWorkingDir();

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.on("line", (input) => this.checkCommand(input));
    rl.on("close", () => this.handleExit());
  }
}

new App();

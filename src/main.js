import os from "os";
import readline from "readline/promises";
import Os from "./modules/Os.js";
import Log from "./modules/Log.js";
import Nwd from "./modules/Nwd.js";

class App {
  commands = {
    exit: ".exit",
    os: "os",
    up: "up",
    cd: "cd",
    ls: "ls",
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
    const user = process.argv
      .find((arg) => arg.startsWith("--"))
      .replace("--username=", "");
    return user[0].toUpperCase() + user.slice(1);
  }

  async checkCommand(input) {
    const command = input.match(/^[.a-z]+/g)[0];

    switch (command) {
      case this.commands.exit:
        this.handleExit();
        break;
      case this.commands.up:
        this.modules.nwd.up();
        break;
      case this.commands.cd:
        const dir = input.replace("cd ", "");
        await this.modules.nwd.cd(dir);
        break;
      case this.commands.ls:
        await this.modules.nwd.ls();
        break;
      case this.commands.os:
        const option = input.replace("os ", "");
        this.modules.os.checkOption(option);
        break;
      default:
        break;
    }

    this.printCurrentWorkingDir();
  }

  init() {
    this.modules = {
      os: new Os(),
      log: new Log(),
      nwd: new Nwd(),
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

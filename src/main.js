import os from "os";
import readline from "readline/promises";
import Os from "./modules/Os.js";

class App {
  commands = {
    exit: ".exit",
    os: "os",
  };

  constructor() {
    this.init();
  }

  handleExit() {
    this.sayGoodbye(this.user);
    process.exit();
  }

  sayHello(user) {
    console.log(`Welcome to the File Manager, ${user}!`);
  }

  sayGoodbye(user) {
    console.log(`Thank you for using File Manager, ${user}, goodbye!`);
  }

  printCurrentWorkingDir() {
    console.log(`You are currently in ${this.currentWorkingDir}`);
  }

  getUsername() {
    const user = process.argv
      .find((arg) => arg.startsWith("--"))
      .replace("--username=", "");
    return user[0].toUpperCase() + user.slice(1);
  }

  checkCommand(input) {
    const command = input.match(/^[.a-z]+/g)[0];

    switch (command) {
      case this.commands.exit:
        this.handleExit();
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
    };

    this.user = this.getUsername();
    this.currentWorkingDir = os.homedir();

    this.sayHello(this.user);
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

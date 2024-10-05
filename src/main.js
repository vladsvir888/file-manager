import os from "os";
import readline from "readline/promises";

class App {
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
    const user = process.argv.find((arg) => arg.startsWith("--")).split("=")[1];
    return user[0].toUpperCase() + user.slice(1);
  }

  checkCommand(input) {
    switch (input) {
      case ".exit":
        this.handleExit();
        break;
      default:
        break;
    }
  }

  init() {
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

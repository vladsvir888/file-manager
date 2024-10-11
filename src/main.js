import os from "os";
import readline from "readline/promises";
import Os from "./modules/Os.js";
import Log from "./modules/Log.js";
import Nwd from "./modules/Nwd.js";
import Hash from "./modules/Hash.js";
import Helpers from "./modules/Helpers.js";
import Zip from "./modules/Zip.js";

class App {
  commands = {
    exit: ".exit",
    os: "os",
    up: "up",
    cd: "cd",
    ls: "ls",
    hash: "hash",
    compress: "compress",
    decompress: "decompress",
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
    const user = process.env.npm_config_username
      ? process.env.npm_config_username
      : process.argv.find((arg) => /^--username=\S+$/.test(arg));

    if (!user) {
      this.modules.log.log(`${Helpers.messages.incorrectUsername()}`, "red");
      return "Stranger";
    }

    return user.replace("--username=", "");
  }

  async checkCommand(input) {
    const command = input.trim().match(/^[.a-z]+/g)?.[0];

    switch (command) {
      case this.commands.exit:
        this.handleExit();
        break;
      case this.commands.up:
        this.modules.nwd.up();
        break;
      case this.commands.cd:
        const dir = Helpers.replaceAndTrim(input);
        await this.modules.nwd.cd(dir);
        break;
      case this.commands.ls:
        await this.modules.nwd.ls();
        break;
      case this.commands.os:
        const option = Helpers.replaceAndTrim(input);
        this.modules.os.checkOption(option);
        break;
      case this.commands.hash:
        const file = Helpers.replaceAndTrim(input);
        await this.modules.hash.printHash(file);
        break;
      case this.commands.compress:
      case this.commands.decompress:
        const files = Helpers.replaceAndTrim(input).split(/\s+/);
        const [pathToSrc, pathToDest] = files;

        if (command === this.commands.compress) {
          await this.modules.zip.compress(pathToSrc, pathToDest);
        } else {
          await this.modules.zip.decompress(pathToSrc, pathToDest);
        }

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
      zip: new Zip(),
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

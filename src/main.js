import os from "os";
import readline from "readline/promises";
import Os from "./modules/Os.js";
import Log from "./modules/Log.js";
import Nwd from "./modules/Nwd.js";
import Hash from "./modules/Hash.js";
import Helpers from "./modules/Helpers.js";
import Zip from "./modules/Zip.js";
import Fs from "./modules/Fs.js";

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
    cat: "cat",
    add: "add",
    rm: "rm",
    rn: "rn",
    cp: "cp",
    mv: "mv",
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
      this.modules.log.log(Helpers.messages.incorrectUsername, "yellow");
      return "stranger";
    }

    return user.replace("--username=", "");
  }

  async checkCommand(input) {
    let [command, ...rest] = input.match(/(['"])(.*?)\1|\S+/g) || [];

    rest = Helpers.removeQuotes(rest);

    switch (command) {
      case this.commands.exit:
        this.handleExit();
        break;
      case this.commands.up:
        this.modules.nwd.up();
        break;
      case this.commands.cd:
        await this.modules.nwd.cd(rest[0]);
        break;
      case this.commands.ls:
        await this.modules.nwd.ls();
        break;
      case this.commands.cat:
        await this.modules.fs.readAndPrintContent(
          rest[0],
          this.printCurrentWorkingDir.bind(this)
        );
        break;
      case this.commands.add:
        await this.modules.fs.createFile(rest[0]);
        break;
      case this.commands.rn:
        const [oldFile, newFile] = rest;
        await this.modules.fs.renameFile(oldFile, newFile);
        break;
      case this.commands.cp: {
        const [oldPath, newPath] = rest;
        await this.modules.fs.copyFile(oldPath, newPath);
        break;
      }
      case this.commands.mv: {
        const [oldPath, newPath] = rest;
        await this.modules.fs.moveFile(oldPath, newPath);
        break;
      }
      case this.commands.rm:
        await this.modules.fs.deleteFile(rest[0]);
        break;
      case this.commands.os:
        this.modules.os.checkOption(rest[0]);
        break;
      case this.commands.hash:
        await this.modules.hash.printHash(rest[0]);
        break;
      case this.commands.compress:
      case this.commands.decompress:
        const [pathToSrc, pathToDest] = rest;

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

    if (command !== this.commands.cat) {
      this.printCurrentWorkingDir();
    }
  }

  init() {
    this.modules = {
      os: new Os(),
      log: new Log(),
      nwd: new Nwd(),
      hash: new Hash(),
      zip: new Zip(),
      fs: new Fs(),
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

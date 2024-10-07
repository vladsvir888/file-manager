class Log {
  #colors = {
    gray: "\x1b[90m",
    cyan: "\x1b[36m",
    red: "\x1b[31m",
  };
  #reset = "\x1b[0m";

  log(text, color = "gray") {
    console.log(this.#colors[color] + text + this.#reset);
  }
}

export default Log;

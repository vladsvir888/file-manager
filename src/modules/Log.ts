class Log {
  private colors = {
    gray: "\x1b[90m",
    cyan: "\x1b[36m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
  };
  private reset = "\x1b[0m";

  public log(text: string, color: keyof typeof this.colors = "gray"): void {
    console.log(this.colors[color] + text + this.reset);
  }
}

export default Log;

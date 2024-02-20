class logger5ws {
  constructor({ who, what, where, when, why }) {
    this.who = who || "N/D";
    this.what = what || "N/D";
    this.where = where || "N/D";
    this.when = when || "N/D";
    this.why = why || "N/D";
  }

  log() {
    return `${this.who} | ${this.what} | ${this.where} | ${this.when} | ${this.why}`;
  }
}

module.exports = logger5ws;

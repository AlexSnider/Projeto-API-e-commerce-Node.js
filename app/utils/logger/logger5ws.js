class logger5ws {
  constructor({ who, ipAddress, what, where, when, why }) {
    this.who = who || "*";
    this.ipAddress = ipAddress || "*";
    this.what = what || "*";
    this.where = where || "*";
    this.when = when || "*";
    this.why = why || "*";
  }

  log() {
    return `User ${this.who} | From ${this.ipAddress} | ${this.what} | At ${this.where} | On ${this.when} | Reason ${this.why}`;
  }
}

module.exports = logger5ws;

const { createLogger, transports, format } = require("winston");

const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf((log) => `[${log.timestamp}] [${log.level.toUpperCase()}] - ${log.message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "logs.log",
    }),
  ],
});

module.exports = logger;

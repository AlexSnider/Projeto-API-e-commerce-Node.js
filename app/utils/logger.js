const winston = require("winston");
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(timestamp(), logFormat),
  transports: [new transports.Console(), new transports.File({ filename: "logs.log" })],
});

logger.stream = {
  write: function (message, encoding) {
    logger.info(message.trim());
  },
};

logger.log5W = (level, what, when, where, who, why) => {
  const logMessage = `[${when}] ${who} - ${what} at ${where}. Reason: ${why}`;
  logger[level](logMessage);
};

module.exports = logger;

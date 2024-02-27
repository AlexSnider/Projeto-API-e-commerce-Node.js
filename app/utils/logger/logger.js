const { createLogger, transports, format } = require("winston");
const logger5ws = require("./logger5ws");

const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf((log) => {
      const logInstance = new logger5ws(log);
      return `[${log.timestamp} | Tracer ID:${log.trace_id} | Span ID:${
        log.span_id
      }] [${log.level.toUpperCase()}] - ${logInstance.log()}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "logs.log",
    }),
  ],
});

module.exports = logger;

const rateLimit = require("express-rate-limit");
const RATE_LIMIT_TIMEOUT = process.env.RATE_LIMIT_TIMEOUT;

const globalRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_TIMEOUT,
  max: 500,
  handler: (req, res) => {
    res.status(429).json({
      error: true,
      message: "The API has been rate limited.",
    });
  },
});

module.exports = globalRateLimiter;

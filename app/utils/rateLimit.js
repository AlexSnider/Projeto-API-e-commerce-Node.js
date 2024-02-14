const rateLimit = require("express-rate-limit");
const RATE_LIMIT_TIMEOUT = process.env.RATE_LIMIT_TIMEOUT;

const limiter = rateLimit({
  windowMs: RATE_LIMIT_TIMEOUT,
  max: 10,
  keyGenerator: (req) => req.clientIp + req.macAddress,
  handler: (req, res) => {
    res.status(429).json({
      error: true,
      message: "Too many requests, please try again later.",
      clientIp: req.clientIp,
      macAddress: req.macAddress,
    });
  },
});

const checkMacAddress = (req, res, next) => {
  const clientMacAddress = getmac.default();

  if (clientMacAddress) {
    next();
  } else {
    res.status(500).json({
      error: true,
      message: "No mac address found. Not allowed to access.",
    });
  }
};

(module.exports = limiter), checkMacAddress;

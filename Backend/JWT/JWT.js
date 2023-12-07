const JWT_SECRET = process.env.JWT_SECRET;

const { sign, verify } = require("jsonwebtoken");

const createToken = (user) => {
  const accessToken = sign(
    {
      id: user.id,
      username: user.username,
    },
    JWT_SECRET
  );

  return accessToken;
};

const verifyToken = (req, res, next) => {
  const accessToken = req.cookies["access_token"];

  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const validToken = verify(accessToken, JWT_SECRET);
    if (!validToken) {
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized", error: err });
  }
};

module.exports = { createToken, verifyToken };

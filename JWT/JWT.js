const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const UserAccessToken = require("../models/UserAccessToken");
const UserRefreshToken = require("../models/UserRefreshToken");

const { sign, verify } = require("jsonwebtoken");

const createToken = (user, expiresIn) => {
  const accessToken = sign(
    {
      id: user.id,
      username: user.username,
    },
    JWT_SECRET,
    {
      expiresIn,
    }
  );

  return accessToken;
};

const createRefreshToken = (user, expiresIn) => {
  const refreshToken = sign(
    {
      userId: user.id,
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn,
    }
  );

  return refreshToken;
};

const tokenTimeLeft = (accessToken) => {
  const expirationTime = accessToken.exp * 1000;
  const currentTime = Date.now();
  const timeLeft = expirationTime - currentTime;
  const threshold = 5 * 60 * 1000;

  return timeLeft < threshold;
};

const renewAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies["refresh_token"];

    if (!refreshToken) {
      return res.status(400).json({ message: "Unauthorized!" });
    }

    const decodedRefreshToken = verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = decodedRefreshToken.user;

    const validAccessToken = await UserAccessToken.findOne({
      where: {
        userId: user.id,
        revoked: false,
      },
    });

    if (!validAccessToken) {
      return res.status(400).json({ message: "Unauthorized!" });
    }

    const validRefreshToken = await UserRefreshToken.findOne({
      where: {
        refreshToken: refreshToken,
        revoked: false,
      },
    });

    if (!validRefreshToken) {
      return res.status(401).json({ message: "Refresh token revoked!" });
    }

    const newAccessToken = sign({ user }, JWT_SECRET);

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    await validAccessToken.update({ revoked: true });
    await validRefreshToken.update({ revoked: true });

    return next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Unauthorized", error: err });
  }
};

const verifyToken = (req, res, next) => {
  const accessToken = req.cookies["access_token"];

  if (!accessToken) {
    return renewAccessToken(req, res, next);
  }

  try {
    const validToken = verify(accessToken, JWT_SECRET);

    if (tokenTimeLeft(validToken)) {
      return renewAccessToken(req, res, next);
    }

    req.authenticated = true;
    next();
  } catch (err) {
    console.log(err);
    return renewAccessToken(req, res, next);
  }
};

module.exports = { createToken, createRefreshToken, verifyToken };

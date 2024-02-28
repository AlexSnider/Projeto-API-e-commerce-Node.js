const {
  CustomValidationException,
  NotFoundException,
} = require("../controllers/customExceptions/customExceptions");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const { Op } = require("sequelize");
const argon2 = require("argon2");
const logger = require("../../utils/logger/logger");
const logger5ws = require("../../utils/logger/logger5ws");

const User = require("../../../models/User");
const sendEmail = require("../mails/passwordMailer");
const UserAccessToken = require("../../../models/UserAccessToken");
const UserRefreshToken = require("../../../models/UserRefreshToken");
const { createToken, createRefreshToken } = require("../../../JWT/JWT");
const { verify } = require("jsonwebtoken");

const userController = {};

userController.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const endpoint = req.originalUrl;

    if (!username || !email || !password) {
      const logData = new logger5ws({
        who: `${username}`,
        what: "Tryed to create an account without username, email or password.",
        where: endpoint,
      });

      logger.log({
        level: "warn",
        ...logData,
      });

      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: email }],
      },
    });

    if (existingUser) {
      if (existingUser.username === username) {
        const logData = new logger5ws({
          who: `${username}`,
          what: "Tryed to create an account with an existing username.",
          where: endpoint,
        });

        logger.log({
          level: "warn",
          ...logData,
        });

        return res.status(400).json({ message: "Oops! Something went wrong. Try again." });
      } else if (existingUser.email === email) {
        const logData = new logger5ws({
          who: `${username}`,
          what: "Tryed to create an account with an existing email.",
          where: endpoint,
        });

        logger.log({
          level: "warn",
          ...logData,
        });

        return res.status(400).json({ message: "Oops! Something went wrong. Try again." });
      }
    }

    try {
      const hashedPassword = await argon2.hash(password, {
        timeCost: 2,
        memoryCost: 2 ** 12,
        parallelism: 1,
      });

      await User.create({
        username,
        email,
        password: hashedPassword,
      });

      const users = await User.findOne({ where: { email } });
      res.location(`/v1/users/${users.id}`);

      const logData = new logger5ws({
        who: `${username}`,
        what: "Created an account.",
        where: endpoint,
      });

      logger.log({
        level: "info",
        ...logData,
      });

      res.status(201).json({
        error: false,
        message: "If created successfully an email will be sent.",
      });
    } catch (error) {
      throw new CustomValidationException({
        error: true,
        message: "Error during password hashing",
      });
    }
  } catch (error) {
    console.log(error);
    if (error instanceof CustomValidationException) {
      res.status(400).json({ error: true, message: error.message });
    } else if (error instanceof NotFoundException) {
      res.status(404).json({ error: true, message: error.message });
    } else {
      res.status(500).json({ error: true, message: error.message });
    }
  }
};

userController.resetPassword = async (req, res) => {
  try {
    const { email, username } = req.body;

    const endpoint = req.originalUrl;

    if (!email || !username) {
      const logData = new logger5ws({
        who: `${username}`,
        what: "Tryed to reset password without email or username.",
        where: endpoint,
      });

      logger.log({
        level: "warn",
        ...logData,
      });

      return res.status(400).json({ error: true, message: "All fields are required!" });
    }

    const userData = await User.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: email }],
      },
    });

    if (!userData) {
      const logData = new logger5ws({
        who: `${username}`,
        what: "Tryed to reset password without existing username or email.",
        where: endpoint,
      });

      logger.log({
        level: "warn",
        ...logData,
      });

      return res.status(404).json({ error: true, message: "Oops! Something went wrong." });
    }

    const userFound = userData ? userData.username : userData.email;

    const resetTokenDuration = 10 * 60 * 1000;
    const resetToken = createToken(userFound, resetTokenDuration);

    if (userData) {
      await userData.set("resetPasswordToken", resetToken).save();
    }

    sendEmail(email, username, resetToken);

    const logData = new logger5ws({
      who: `${username}`,
      what: "Requested password reset.",
      where: endpoint,
    });

    logger.log({
      level: "info",
      ...logData,
    });

    res.status(200).json({
      error: false,
      message: "Password reset link has been sent to the E-mail registered.",
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

userController.resetPasswordLoggedUser = async (req, res) => {
  try {
    const token = req.cookies["access_token"];

    const endpoint = req.originalUrl;

    if (!token) {
      return res.status(400).json({ message: "Token is required!" });
    }

    const decodedUser = verify(token, JWT_SECRET, { complete: true }, (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: "Oops! Token is invalid." });
      }

      return decoded.payload.id;
    });

    if (decodedUser) {
      const logData = new logger5ws({
        who: `${decodedUser}`,
        what: "Is trying to change it's password.",
        where: endpoint,
      });

      logger.log({
        level: "info",
        ...logData,
      });
    }

    const { oldPassword, password, confirmPassword } = req.body;

    if (!oldPassword || !password || !confirmPassword) {
      const logData = new logger5ws({
        who: `${decodedUser}`,
        what: "Tryed to reset password without oldPassword, password or confirmPassword.",
        where: endpoint,
      });

      logger.log({
        level: "warn",
        ...logData,
      });
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (password !== confirmPassword) {
      const logData = new logger5ws({
        who: `${decodedUser}`,
        what: "Tryed to reset password without matching password.",
        where: endpoint,
      });

      logger.log({
        level: "warn",
        ...logData,
      });

      return res
        .status(400)
        .json({ message: "The confirmation of the password does not match. Try again." });
    }

    const findUser = await User.findOne({ where: { id: decodedUser } });

    if (!findUser) {
      const logData = new logger5ws({
        who: `${decodedUser}`,
        what: "Tryed to reset password but user does not exist in the database.",
        where: endpoint,
      });

      logger.log({
        level: "warn",
        ...logData,
      });
      return res.status(404).json({ message: "Oops! Something went wrong." });
    }

    const findAccessToken = await UserAccessToken.findOne({
      where: { userId: decodedUser, revoked: false, accessToken: token },
    });

    if (!findAccessToken) {
      const logData = new logger5ws({
        who: `${decodedUser}`,
        what: "Tryed to reset password but Access Token is invalid.",
        where: endpoint,
      });

      logger.log({
        level: "warn",
        ...logData,
      });

      return res.status(404).json({ message: "Invalid token!" });
    }

    const isPasswordValid = await argon2.verify(findUser.password, oldPassword);

    if (!isPasswordValid) {
      const logData = new logger5ws({
        who: `${decodedUser}`,
        what: "Tryed to reset password but oldPassword is invalid.",
        where: endpoint,
      });

      logger.log({
        level: "warn",
        ...logData,
      });
      return res.status(400).json({ message: "Something went wrong. Try again." });
    }

    const hashedPassword = await argon2.hash(String(password), {
      timeCost: 2,
      memoryCost: 2 ** 12,
      parallelism: 1,
    });

    await User.update({ password: hashedPassword }, { where: { id: decodedUser } });

    await UserAccessToken.update({ revoked: true }, { where: { userId: decodedUser } });
    await UserRefreshToken.update({ revoked: true }, { where: { userId: decodedUser } });

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    const logData = new logger5ws({
      who: `${decodedUser}`,
      what: "Tryed to reset password and changed it's password. Cookies were cleared.",
      where: endpoint,
    });

    logger.log({
      level: "info",
      ...logData,
    });

    res
      .status(200)
      .json({ error: false, message: "If changed successfully you will be logged out." });
  } catch (error) {
    if (error instanceof CustomValidationException) {
      res.status(400).json({ error: true, message: error.message });
    } else if (error instanceof NotFoundException) {
      res.status(404).json({ error: true, message: error.message });
    } else {
      res.status(500).json({ error: true, message: error.message });
    }
  }
};

userController.changePasswordConfirmation = async (req, res) => {
  try {
    const { token } = req.params;

    const endpoint = req.originalUrl;

    if (!token) {
      return res.status(400).json({ message: "Token is required!" });
    }
    const decodedUser = verify(token, JWT_SECRET, { complete: true }, (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: "Oops! Token is invalid." });
      }

      return decoded.payload.id;
    });
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      const logData = new logger5ws({
        who: `${decodedUser}`,
        what: "Tryed to reset password but user does not exist in the database.",
        where: endpoint,
      });

      logger.log({
        level: "warn",
        ...logData,
      });

      return res.status(400).json({ message: "All fields are required!" });
    }

    if (password !== confirmPassword) {
      const logData = new logger5ws({
        who: `${decodedUser}`,
        what: "Tryed to change password but passwords do not match.",
        where: endpoint,
      });

      logger.log({
        level: "warn",
        ...logData,
      });

      return res.status(400).json({ message: "Something went wrong. Try again. 1" });
    }

    const userResetPasswordToken = await User.findOne({
      where: { resetPasswordToken: token },
    });

    if (!userResetPasswordToken) {
      const logData = new logger5ws({
        who: `${decodedUser}`,
        what: "Tryed to reset password but Reset Password Token does not exist in the database.",
        where: endpoint,
      });

      logger.log({
        level: "warn",
        ...logData,
      });
      return res.status(400).json({ message: "Something went wrong. Try again. 3" });
    }

    const hashedPassword = await argon2.hash(String(password), {
      timeCost: 2,
      memoryCost: 2 ** 12,
      parallelism: 1,
    });

    const isDifferent = !(await argon2.verify(userResetPasswordToken.password, String(password)));

    if (!isDifferent) {
      const logData = new logger5ws({
        who: `${decodedUser}`,
        what: "Tryed to reset password but new password is the same as old.",
        where: endpoint,
      });

      logger.log({
        level: "warn",
        ...logData,
      });
      return res.status(400).json({ message: "Oops! Something went wrong. Try again. 6" });
    }

    const [, updatedRows] = await User.update(
      { password: hashedPassword, resetPasswordToken: null },
      { where: { resetPasswordToken: token } }
    );

    if (updatedRows === 0) {
      const logData = new logger5ws({
        who: `${decodedUser}`,
        what: "Tryed to reset password but zero rows were updated.",
        where: endpoint,
      });

      logger.log({
        level: "warn",
        ...logData,
      });
      return res.status(404).json({ message: "Oops! Something went wrong. 7" });
    }

    const logData = new logger5ws({
      who: `${decodedUser}`,
      what: "Tryed to reset password and changed it's password successfully.",
      where: endpoint,
    });

    logger.log({
      level: "info",
      ...logData,
    });

    res
      .status(200)
      .json({ error: false, message: "If changed successfully an email will be sent." });
  } catch (error) {
    if (error instanceof CustomValidationException) {
      res.status(400).json({ error: true, message: error.message });
    } else if (error instanceof NotFoundException) {
      res.status(404).json({ error: true, message: error.message });
    } else {
      res.status(500).json({ error: true, message: error.message });
    }
  }
};

userController.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const endpoint = req.originalUrl;

    if (!username || !password) {
      const logData = new logger5ws({
        who: `${username}`,
        what: "Tryed to login without username or password.",
        where: endpoint,
      });

      logger.log({
        level: "warn",
        ...logData,
      });

      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingToken = req.cookies["access_token"];

    if (existingToken) {
      const logData = new logger5ws({
        who: `${username}`,
        what: "Tryed to login again without logging out.",
        where: endpoint,
      });

      logger.log({
        level: "warn",
        ...logData,
      });

      return res.status(400).json({ message: "You are already logged in!" });
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      const logData = new logger5ws({
        who: `${username}`,
        what: "Tryed to login with wrong username.",
        where: endpoint,
      });

      logger.log({
        level: "warn",
        ...logData,
      });

      return res.status(404).json({ message: "Oops! Something went wrong..." });
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      const logData = new logger5ws({
        who: `${username}`,
        what: "Tryed to login with wrong password.",
        where: endpoint,
      });

      logger.log({
        level: "warn",
        ...logData,
      });

      return res.status(400).json({ message: "Oops! Try again..." });
    }

    const acessTokenDuration = 24 * 60 * 60 * 1000;
    const refreshTokenDuration = 7 * 24 * 60 * 60 * 1000;

    const accessToken = createToken(user, acessTokenDuration);
    const refreshToken = createRefreshToken(user, refreshTokenDuration);

    if (!refreshToken || !accessToken) {
      const logData = new logger5ws({
        who: `${username}`,
        what: "Had either an invalid refresh token or an invalid access token.",
        where: endpoint,
      });

      logger.log({
        level: "critical",
        ...logData,
      });

      return res.status(500).json({ message: "Oops! Something went wrong..." });
    }

    await UserAccessToken.create({
      accessToken,
      userId: user.id,
      expirationDate: new Date(Date.now() + acessTokenDuration),
    });

    await UserRefreshToken.create({
      refreshToken,
      userId: user.id,
      expirationDate: new Date(Date.now() + refreshTokenDuration),
    });

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: acessTokenDuration,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: refreshTokenDuration,
    });

    const logData = new logger5ws({
      who: `${username}`,
      what: "Logged in successfully",
      where: endpoint,
    });

    logger.log({
      level: "info",
      ...logData,
    });

    res.status(200).json({
      error: false,
      message: "If logged in successfully you will be redirected...",
    });
  } catch (error) {
    if (error instanceof CustomValidationException) {
      res.status(400).json({ error: true, message: error.message });
    } else if (error instanceof NotFoundException) {
      res.status(404).json({ error: true, message: error.message });
    } else {
      res.status(500).json({ error: true, message: error.message });
    }
  }
};

userController.logoutUser = async (req, res) => {
  try {
    const accessToken = req.cookies["access_token"];
    const refreshToken = req.cookies["refresh_token"];

    if (!accessToken || !refreshToken) {
      return res.status(404).json({ message: "Oops! Something went wrong." });
    }

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    res.status(200).json({
      error: false,
      message: "If logged out successfully you will be redirected.",
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

module.exports = userController;

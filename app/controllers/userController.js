const {
  CustomValidationException,
  NotFoundException,
} = require("../controllers/customExceptions/customExceptions");

const User = require("../../models/User");
const { createToken, createRefreshToken } = require("../../JWT/JWT");
const sendEmail = require("../mail/passwordMailer");
const UserRefreshToken = require("../../models/UserRefreshToken");
const { Op } = require("sequelize");
const argon2 = require("argon2");

const userController = {};

userController.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required..." });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: email }],
      },
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already exists!" });
      } else if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already exists!" });
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

      res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
      console.log("Error during password hashing: ", error);
      throw new CustomValidationException("Error during password hashing");
    }
  } catch (error) {
    console.log(error);
    if (error instanceof CustomValidationException) {
      res.status(400).json({ message: error.message });
    } else if (error instanceof NotFoundException) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

userController.resetPassword = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({ message: "All fields are required..." });
    }

    const userData = await User.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: email }],
      },
    });

    if (!userData) {
      return res.status(404).json({ message: "User not found!" });
    }

    const userFound = userData ? userData.username : userData.email;

    const resetToken = createToken(userFound);

    if (userData) {
      await userData.set("resetPasswordToken", resetToken).save();
    }

    sendEmail(email, username, resetToken);

    res
      .status(200)
      .json({ message: "Password reset link has been sent to the E-mail registered!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

userController.changePasswordConfirmation = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Token is required!" });
    }

    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "The new password and it's confirmation is required!" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match. Try again!" });
    }

    const hashedPassword = await argon2.hash(String(password), {
      timeCost: 2,
      memoryCost: 2 ** 12,
      parallelism: 1,
    });

    const user = await User.findOne({ where: { resetPasswordToken: token } });

    if (!user) {
      return res.status(404).json({ message: "User not found or invalid token!" });
    }

    const isDifferent = !(await argon2.verify(user.password, String(password)));

    if (!isDifferent) {
      return res
        .status(400)
        .json({ message: "New password must be different from the current password!" });
    }

    const [, updatedRows] = await User.update(
      { password: hashedPassword, resetPasswordToken: null },
      { where: { resetPasswordToken: token } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Password not updated!" });
    }

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    if (error instanceof CustomValidationException) {
      res.status(400).json({ message: error.message });
    } else if (error instanceof NotFoundException) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

userController.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingToken = req.cookies["access_token"];

    if (existingToken) {
      return res.status(401).json({ message: "You are already logged in!" });
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const accessToken = createToken(user);

    const refreshTokenDuration = 7 * 24 * 60 * 60 * 1000;

    const refreshToken = createRefreshToken(user, refreshTokenDuration);

    if (!refreshToken || !accessToken) {
      return res.status(500).json({ message: "Failed to generate token!" });
    }

    await UserRefreshToken.create({
      refreshToken,
      userId: user.id,
      expirationDate: new Date(Date.now() + refreshTokenDuration),
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: refreshTokenDuration,
    });

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000,
    });

    res.status(200).json({ message: "Login successful!", accessToken, refreshToken });
  } catch (error) {
    if (error instanceof CustomValidationException) {
      res.status(400).json({ message: error.message });
    } else if (error instanceof NotFoundException) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

userController.logoutUser = async (req, res) => {
  try {
    const accessToken = req.cookies["access_token"];
    const refreshToken = req.cookies["refresh_token"];

    if (!accessToken || !refreshToken) {
      return res.status(404).json({ message: "No token was provided!" });
    }

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    res.status(200).json({ message: "Logout successfully done!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = userController;

const User = require("../../models/User");
const { createToken } = require("../../JWT/JWT");
const bcrypt = require("bcrypt");
const sendEmail = require("../mail/passwordMailer");
const saltRounds = 10;

const userController = {};

userController.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const existingEmail = await User.findOne({ where: { email } });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already cadastrated!" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

userController.changePassword = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userMail = await User.findOne({ where: { email } });
    const user = await User.findOne({ where: { username } });

    if (!userMail && !user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userFound = user ? user.username : userMail.username;

    const resetToken = createToken(userFound);

    if (userMail) {
      await userMail.set("resetPasswordToken", resetToken).save();
    }

    sendEmail(email, username, resetToken);

    res.status(200).json({ message: "Password reset link has been sent to the E-mail registered." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

userController.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Token is required!" });
    }

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "The new password is required!" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.findOne({ where: { resetPasswordToken: token } });

    if (!user) {
      return res.status(404).json({ message: "User not found or invalid token!" });
    }

    const ifDifferent = await bcrypt.compare(password, user.password);
    if (!ifDifferent) {
      const [, updatedRows] = await User.update(
        { password: hashedPassword, resetPasswordToken: null },
        { where: { resetPasswordToken: token } }
      );

      if (updatedRows === 0) {
        return res.status(404).json({ message: "Password not updated!" });
      }

      res.status(200).json({ message: "Password updated successfully!" });
    } else {
      return res
        .status(400)
        .json({ message: "New password must be different from the current password!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

userController.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = createToken(user);

    if (!accessToken) {
      return res.status(500).json({ message: "Failed to generate token!" });
    }

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

userController.logoutUser = async (req, res) => {
  try {
    const accessToken = req.cookies["access_token"];

    if (!accessToken) {
      return res.status(404).json({ message: "No token was provided" });
    }

    res.clearCookie("access_token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = userController;

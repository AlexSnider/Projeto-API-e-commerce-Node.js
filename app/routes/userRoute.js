const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.put("/reset-password", userController.resetPassword);
router.post("/change-password/:token", userController.changePasswordConfirmation);
router.post("/logout", userController.logoutUser);

module.exports = router;

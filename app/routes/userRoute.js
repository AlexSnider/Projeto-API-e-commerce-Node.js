const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.put("/change-password", userController.changePassword);
router.post("/reset-password/:token", userController.resetPassword);
router.post("/logout", userController.logoutUser);

module.exports = router;

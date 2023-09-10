const express = require("express");
const authenticateUser = require("../middleware/authentication");

const router = express.Router();
const { register, login, logout } = require("../controllers/auth");
router.post("/register", register);
router.post("/login", login);
router.get("/logout", authenticateUser, logout);

module.exports = router;

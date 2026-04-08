const express = require("express");
const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");
const {
  validate,
  registerRules,
  loginRules,
} = require("../middleware/validate");
const authenticate = require("../middleware/auth");

const router = express.Router();

// POST /auth/register - Register new user
router.post("/register", validate(registerRules), register);

// POST /auth/login - Login user
router.post("/login", validate(loginRules), login);

// GET /auth/profile - Get current user (protected)
router.get("/profile", authenticate, getProfile);

module.exports = router;

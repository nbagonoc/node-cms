const express = require("express");
const router = express.Router();

// change the main layout to user, isntead of the main layout
router.all("/*", (req, res, next) => {
  req.app.locals.layout = "guest";
  next();
});

// initial route
router.get("/", (req, res) => {
  res.render("guest/home");
});

// login
router.get("/login", (req, res) => {
  res.render("guest/login");
});

// register
router.get("/register", (req, res) => {
  res.render("guest/register");
});

module.exports = router;

const express = require("express");
const router = express.Router();

// change the main layout to user, isntead of the main layout
router.all("/*", (req, res, next) => {
  req.app.locals.layout = "user";
  next();
});

// initial route
router.get("/dashboard", (req, res) => {
  res.render("user/dashboard");
});

module.exports = router;

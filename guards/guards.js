module.exports = {
  // Access control
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("error_message", "Please login");
      res.redirect("/login");
    }
  }
};

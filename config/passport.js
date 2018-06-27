const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const config = require("./dbSecretKeys");
const bcrypt = require("bcryptjs");

module.exports = passport => {
  // Local Strategy
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match Email
      User.findOne({ email }, (err, user) => {
        if (err) throw err;
        if (!user) {
          return done(null, false, { message: "No user found" });
        }

        // Match Password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Wrong password" });
          }
        });
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};

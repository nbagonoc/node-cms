const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Category = require("../../models/Category");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// change the main layout to user, isntead of the main layout
router.all("/*", (req, res, next) => {
  req.app.locals.layout = "guest";
  next();
});

// GET | initial route view posts
router.get("/", (req, res) => {
  const perPage = 10;
  const page = req.query.page || 1;

  Post.find({})
    .populate("user")
    .skip(perPage * page - perPage)
    .limit(perPage)
    .sort({ _id: -1 })
    .then(datas => {
      Post.count().then(postCount => {
        Post.find({})
          .limit(10)
          .sort({ _id: -1 })
          .then(otherPosts => {
            res.render("guest/home", {
              datas,
              otherPosts,
              current: parseInt(page),
              pages: Math.ceil(postCount / perPage)
            });
          })
          .catch(error => {
            console.log("cound not view categories");
          });
      });
    })
    .catch(error => {
      console.log("cound not view posts");
    });
});

// GET | login
router.get("/login", (req, res) => {
  res.render("guest/login");
});

// POST | login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/user/dashboard",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next);
});

// GET | logout route
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_message", "You have successfully logged out");
  res.redirect("/login");
});

// GET | register
router.get("/register", (req, res) => {
  res.render("guest/register");
});

// POST | register process
router.post("/register", (req, res) => {
  let errors = [];
  const { firstName, lastName, email, password, passwordConfirm } = req.body;

  if (!firstName) {
    errors.push({ message: "Name is required" });
  }
  if (!lastName) {
    errors.push({ message: "Last name is required" });
  }
  if (!email) {
    errors.push({ message: "Email is required" });
  }
  if (!password) {
    errors.push({ message: "Password is required" });
  }
  if (password != passwordConfirm) {
    errors.push({ message: "Confirm password did not match" });
  }
  if (errors.length > 0) {
    res.render("guest/register", {
      errors,
      firstName,
      lastName,
      email,
      password,
      passwordConfirm
    });
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash("error_message", "Email already exist");
        res.render("guest/register", {
          firstName,
          lastName,
          email,
          password,
          passwordConfirm
        });
      } else {
        const newUser = new User({
          firstName,
          lastName,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_message",
                  "You are now registered, and can now login"
                );
                res.redirect("/login");
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

module.exports = router;

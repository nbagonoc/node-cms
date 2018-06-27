const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Category = require("../../models/Category");
const Comment = require("../../models/Comment");

// change the main layout to user, isntead of the main layout
router.all("/*", (req, res, next) => {
  req.app.locals.layout = "guest";
  next();
});

// GET | view single post
router.get("/post/:slug", (req, res) => {
  Post.findOne({ slug: req.params.slug })
    .populate({
      path: "comments",
      match: { approveComment: true },
      populate: { path: "user", model: "users" }
    })
    .populate("user")
    .then(data => {
      Post.find({})
        .limit(10)
        .sort({ _id: -1 })
        .then(otherPosts => {
          res.render("guest/post", { data, otherPosts });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(error => {
      console.log("cound not view posts");
    });
});

module.exports = router;

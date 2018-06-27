const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const { ensureAuthenticated } = require("../../guards/guards");

// change the main layout to user, isntead of the main layout
router.all("/*", (req, res, next) => {
  req.app.locals.layout = "user";
  next();
});

router.post("/approve-comment", (req, res) => {
  Comment.findByIdAndUpdate(
    req.body.id,
    { $set: { approveComment: req.body.approveComment } },
    (err, result) => {
      if (err) return err;
      res.send(result);
    }
  );
});

// GET | View all comments
router.get("/", (req, res) => {
  Comment.find({})
    .populate("user")
    .then(comments => {
      res.render("user/comments", { comments });
    });
});

// POST | submit a comment
router.post("/:id", (req, res) => {
  Post.findOne({ _id: req.params.id }).then(post => {
    const newComment = new Comment({
      user: req.user.id,
      body: req.body.body
    });
    post.comments.push(newComment);
    post.save().then(savePost => {
      newComment.save().then(savedComment => {
        req.flash(
          "success_message",
          "Comment successfully submitted for review"
        );
        res.redirect(`/posts/post/${post.slug}`);
      });
    });
  });
});

// DELETE | delete a comment
router.delete("/delete/:id", (req, res) => {
  Comment.remove({ _id: req.params.id })
    .then(result => {
      Post.findOneAndUpdate(
        { comments: req.params.id },
        { $pull: { comments: req.params.id } },
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            req.flash("success_message", "Successfully deleted comment");
            res.redirect("/user/comments");
          }
        }
      );
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;

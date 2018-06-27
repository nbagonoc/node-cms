const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Category = require("../../models/Category");
const { isEmpty } = require("../../helpers/upload");
const { ensureAuthenticated } = require("../../guards/guards");

// change the main layout to user, isntead of the main layout
router.all("/*", (req, res, next) => {
  req.app.locals.layout = "user";
  next();
});

// view posts
router.get("/", (req, res) => {
  Post.find({ user: req.user.id })
    .populate("category")
    .then(datas => {
      res.render("user/posts", { datas });
    })
    .catch(error => {
      console.log("cound not view posts");
    });
});

// GET create posts
router.get("/create", (req, res) => {
  Category.find({}).then(categories => {
    res.render("user/create", { categories });
  });
});

// POST create posts
router.post("/create", (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ message: "Please enter a title" });
  }
  if (!req.body.body) {
    errors.push({ message: "Please enter a content body" });
  }
  if (errors.length > 0) {
    res.render("user/create", {
      errors
    });
  } else {
    let imageName = "default.png";

    if (!isEmpty(req.files)) {
      let image = req.files.image;
      imageName = Date.now() + "-" + image.name;

      image.mv("./public/uploads/" + imageName, err => {
        if (err) throw err;
      });
    }

    // allow comments checkbox
    let allowComments = true;

    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }

    const newPost = new Post({
      title: req.body.title,
      user: req.user.id,
      category: req.body.category,
      status: req.body.status,
      allowComments: allowComments,
      body: req.body.body,
      image: imageName
    });

    newPost
      .save()
      .then(savedPost => {
        req.flash("success_message", "Successfully created post");
        res.redirect("/user/posts");
      })
      .catch(error => {
        console.log("cound not save post");
      });
  }
});

// GET | edit post
router.get("/edit/:id", (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then(data => {
      Category.find({}).then(categories => {
        res.render("user/edit", { data, categories });
      });
    })
    .catch(error => {
      console.log("cound not view posts");
    });
});

// POST | edit post process
router.patch("/edit/:id", (req, res) => {
  // allow comments checkbox
  let allowComments = true;

  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  Post.findOne({ _id: req.params.id })
    .then(data => {
      data.title = req.body.title;
      data.category = req.body.category;
      data.user = req.user.id;
      data.status = req.body.status;
      data.allowComments = allowComments;
      data.body = req.body.body;

      if (!isEmpty(req.files)) {
        let image = req.files.image;
        imageName = Date.now() + "-" + image.name;
        data.image = imageName;

        image.mv("./public/uploads/" + imageName, err => {
          if (err) throw err;
        });
      }

      data.save().then(updated => {
        req.flash("success_message", "Successfully edited post");
        res.redirect("/user/posts");
      });
    })
    .catch(error => {
      console.log(error);
    });
});

// DELETE | delete a post
router.delete("/delete/:id", (req, res) => {
  Post.findOne({ _id: req.params.id })
    .populate("comments")
    .then(post => {
      if (!post.comments.length < 1) {
        post.comments.forEach(comment => {
          comment.remove();
        });
      }
      post.remove();
      req.flash("success_message", "Successfully deleted post");
      res.redirect("/user/posts");
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;

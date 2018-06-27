const express = require("express");
const router = express.Router();
const faker = require("faker");
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const Category = require("../../models/Category");
const { ensureAuthenticated } = require("../../guards/guards");

// change the main layout to user, isntead of the main layout
router.all("/*", ensureAuthenticated, (req, res, next) => {
  req.app.locals.layout = "user";
  next();
});

// initial route
// router.get("/dashboard", (req, res) => {
//   Post.count({}).then(postCount => {
//     Comment.count({}).then(commentCount => {
//       Category.count({}).then(categoryCount => {
//         res.render("user/dashboard", {
//           postCount,
//           commentCount,
//           categoryCount
//         });
//       });
//     });
//   });
// });

// initial route
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  const promises = [
    Post.count({ user: req.user.id }).exec(),
    Category.count().exec(),
    Comment.count().exec()
  ];
  Promise.all(promises).then(([postCount, categoryCount, commentCount]) => {
    res.render("user/dashboard", {
      postCount,
      commentCount,
      categoryCount
    });
  });
});

// POST Generate dummy data
router.post("/generate-dummy-data", ensureAuthenticated, (req, res) => {
  for (let i = 0; i < req.body.dummyAmount; i++) {
    let data = new Post();

    data.title = faker.name.title();
    data.user = req.user.id;
    data.status = "public";
    data.allowComments = faker.random.boolean();
    data.image = "default.png";
    data.slug = faker.name.title();
    data.body = faker.lorem.sentence();

    data.save(function(err) {
      if (err) throw err;
    });
  }
  res.redirect("/user/posts");
});

module.exports = router;

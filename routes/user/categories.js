const express = require("express");
const router = express.Router();
const Category = require("../../models/Category");
const { ensureAuthenticated } = require("../../guards/guards");

// change the main layout to user, isntead of the main layout
router.all("/*", (req, res, next) => {
  req.app.locals.layout = "user";
  next();
});

// GET | dispaly category page
router.get("/", (req, res) => {
  Category.find({})
    .then(categories => {
      res.render("user/categories", { categories });
    })
    .catch(err => {
      console.log(err);
    });
});

// POST | Create process
router.post("/create", (req, res) => {
  const newCategory = Category({
    name: req.body.name
  });
  newCategory
    .save()
    .then(saveCategory => {
      req.flash("success_message", "Successfully created category");
      res.redirect("/user/categories");
    })
    .catch(err => {
      console.log(err);
    });
});

// GET | edit category page
router.get("/edit/:id", (req, res) => {
  Category.findOne({ _id: req.params.id })
    .then(category => {
      res.render("user/categoriesEdit", { category });
    })
    .catch(err => {
      console.log(err);
    });
});

// PATCH | edit category process
router.patch("/edit/:id", (req, res) => {
  Category.findOne({ _id: req.params.id })
    .then(category => {
      category.name = req.body.name;

      category
        .save()
        .then(updated => {
          req.flash("success_message", "Successfully edited category");
          res.redirect("/user/categories");
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
});

// Delete | delete a category
router.delete("/delete/:id", (req, res) => {
  Category.remove({ _id: req.params.id })
    .then(deleted => {
      req.flash("success_message", "Successfully deleted category");
      res.redirect("/user/categories");
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;

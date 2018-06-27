const express = require("express");
const path = require("path");
const exhbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressValidator = require("express-validator");
const upload = require("express-fileupload");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

// initialize app
const app = express();

// PUBLIC STATIC DIRECTORY
app.use(express.static(path.join(__dirname, "public")));

// CONFIG
const db = require("./config/dbSecretKeys").mongoURI;
const secret = require("./config/dbSecretKeys").secretOrKey;
require("./config/passport")(passport);

// DB CONNECT
mongoose
  .connect(db)
  .then(() => {
    console.log("we are connected to the DB");
  })
  .catch(err => console.log(err));

// HANDLEBAR HELPERS
const { select, formatDate, paginate, isEqual } = require("./helpers/helpers");

// SET TEMPLATING ENGINE
app.engine(
  "handlebars",
  exhbs({
    defaultLayout: "guest",
    helpers: { select, formatDate, paginate, isEqual }
  })
);
app.set("view engine", "handlebars");

// MIDDLEWARS
// body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// method-override
app.use(methodOverride("_method"));
// express-validator
app.use(expressValidator());
// express-file-upload
app.use(upload());
// express-session
app.use(
  session({
    secret,
    resave: true,
    saveUninitialized: true
  })
);
// connect-flash
app.use(flash());
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// LOCAL VARIABLES
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success_message = req.flash("success_message");
  res.locals.error_message = req.flash("error_message");
  res.locals.error = req.flash("error");
  next();
});

// ROUTES
const guestMain = require("./routes/guest/index");
app.use("/", guestMain);
const guestPosts = require("./routes/guest/posts");
app.use("/posts", guestPosts);
const userMain = require("./routes/user/index");
app.use("/user", userMain);
const userPosts = require("./routes/user/posts");
app.use("/user/posts", userPosts);
const userCategories = require("./routes/user/categories");
app.use("/user/categories", userCategories);
const userComments = require("./routes/user/comments");
app.use("/user/comments", userComments);

// SET PORT
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`we are live at ${port}`);
});

const express = require("express");
const app = express();
const path = require("path");
const exhbs = require("express-handlebars");

// public static directory
app.use(express.static(path.join(__dirname, "public")));

// set templating engine
app.engine("handlebars", exhbs({ defaultLayout: "guest" }));
app.set("view engine", "handlebars");

// ROUTES
const mainGuest = require("./routes/guest/main");
app.use("/", mainGuest);
const mainUser = require("./routes/user/main");
app.use("/user", mainUser);

// set port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`we are live at ${port}`);
});

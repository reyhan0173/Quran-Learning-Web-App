const express = require("express");
const session = require("express-session");
const app = express();
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

let sessionOptions = session({
  secret: "Js is so cool",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  },
});

app.use(sessionOptions);
app.use(flash());

const router = require("./router");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.set("views", "views-folder");
app.set("view engine", "ejs");

app.use("/", router);

module.exports = app;

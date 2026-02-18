const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressLayouts);
app.use(cookieParser(process.env.COOKIE_SECRET || "FreeRomsSecure"));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "FreeRomsSecretSession",
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
    },
  })
);
app.use(flash());
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
  })
);

app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

const routes = require("./server/routes/gameRoutes.js");
app.use("/", routes);

app.use((req, res) => {
  res.status(404).render("404", { title: "Page not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: "Internal server error" });
});

app.listen(port, () => console.log(`server listening to ${port}`));

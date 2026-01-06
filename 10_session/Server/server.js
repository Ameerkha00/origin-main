const express = require("express");
const session = require("express-session");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "http://127.0.0.1:5501",
    "http://localhost:5500",
    "http://localhost:5501"
  ],
  credentials: true
}));

app.use(session({
  secret: "mySecretKey123",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  }
}));

app.get("/login/:name", (req, res) => {
  req.session.user = req.params.name;
  res.send("Logged in as " + req.session.user);
});

app.get("/dashboard", (req, res) => {
  if (req.session.user) {
    res.send("Hello " + req.session.user);
  } else {
    res.status(401).send("Not logged in");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.send("Logged out");
  });
});

app.listen(3001, () => console.log("Server running on http://127.0.0.1:3001"));
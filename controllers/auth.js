//express package
const express = require("express");
//encrypt password
const bcrypt = require("bcrypt");

const router = express.Router();

const User = require("../models/user.js");

//*Sign Up GET
router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

//*Sign Up post
router.post("/sign-up", async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username });

  //Check if user is unique
  if (userInDatabase) {
    return res.send("Username already taken.");
  }

  //check if password is same as confirmed
  if (req.body.password !== req.body.confirmPassword) {
    return res.send("Password and Confirm Password must match");
  }

  //encrypt password
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;

  //create user
  // validation logic -  unique username , and password matches confirmed
  const user = await User.create(req.body);
  //res.send(`Thanks for signing up ${user.username}`);
  res.render("auth/sign-in.ejs");
});

//*Sign-In Get
router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});

//*Sign-In POST
router.post("/sign-in", async (req, res) => {
  // First, get the user from the database
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (!userInDatabase) {
    return res.send("Login failed. Please try again.");
  }

  // There is a user! Time to test their password with bcrypt
  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password,
  );
  if (!validPassword) {
    return res.send("Login failed. Please try again.");
  }

  // There is a user AND they had the correct password. Time to make a session!
  // Avoid storing the password, even in hashed format, in the session
  // If there is other data you want to save to `req.session.user`, do so here!
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id,
  };

  res.redirect("/homePage");
});

//*Sign-Out get
router.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;

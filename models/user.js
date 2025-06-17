//open connection with mongoose
const mongoose = require("mongoose");

//create schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//create model
const User = mongoose.model("User", userSchema);

//export model
module.exports = User;

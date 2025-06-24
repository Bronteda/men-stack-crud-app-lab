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
  animal: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal", // Reference to the Animal model
    },
  ],
});

//create model
const User = mongoose.model("User", userSchema);

//export model
module.exports = User;

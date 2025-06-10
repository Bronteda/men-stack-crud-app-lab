//import mongoose
const mongoose = require("mongoose");

//define schema
const animalSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  animalClass: { type: String },
  habitat: { type: String },
  diet: { type: String },
});

//Initialize the model
const Animal = mongoose.model("Animal", animalSchema);

//export
module.exports = Animal;

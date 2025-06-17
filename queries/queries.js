const mongoose = require("mongoose");

//import user
const User = require("../models/user.js");

//import animal model
const Animal = require("../models/animals.js");

const addAnimalToUser = async (userId, animalId) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { animals: animalId } }, // add animal, no duplicates
      { new: true }, // return the updated user object
    );
  } catch (e) {
    console.error("Error adding animal to user:", e);
    throw e;
  }
};

module.exports = { addAnimalToUser };

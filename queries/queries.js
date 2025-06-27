const mongoose = require("mongoose");

//import user
const User = require("../models/user.js");

//import animal model
const Animal = require("../models/animals.js");

const addAnimalToUser = async (userId, animalId) => {
  console.log("hitting this point");
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { animals: animalId } }, // add animal, no duplicates
      { new: true } // return the updated user object
    );

    //check user is being updated- debugging purposes
    if (!updatedUser) {
      console.error(`User with id ${userId} not found`);
    } else {
      console.log(`Animal ${animalId} added to user ${userId}`);
    }
  } catch (e) {
    console.error("Error adding animal to user:", e);
    throw e;
  }
};

const getUserAnimals = async (userId) => {
  try {
    const user = await User.findById(userId).populate("animals");
    //console.log(user);
    return user ? user.animals : [];
  } catch (e) {
    console.error("Error fetching Users animals:", e);
    return [];
  }
};

const removeAnimalForUser = async (userId, animalId) => {
  try {
    //check if user owns the animal
    const user = await User.findById(userId);
    if (!user || !user.animals.includes(animalId)) {
      return { success: false, message: "Unauthorized or animal not found." };
    }
    //delete that specific animal from the animal database
    await Animal.findByIdAndDelete(animalId);
    //delete that animal from the user database
    await User.findByIdAndUpdate(userId, { $pull: { animals: animalId } }); //pull takes away the animal

    return { success: true };
  } catch (e) {
    console.error("Cannot delete animal: ", e);
    return { success: false, message: "Server error." };
  }
};

const updateAnimalDetailsForUser = async (userId, animalId, newInformation) => {
  try {
    //check if user owns the animal
    const user = await User.findById(userId);
    if (!user || !user.animals.includes(animalId)) {
      return { success: false, message: "Unauthorized or animal not found." };
    }
    const updatedAnimal = await Animal.findByIdAndUpdate(
      animalId,
      newInformation
    );

    //Check if animal exists
    if (!updatedAnimal) {
      return { success: false, message: "Animal not found." };
    }

    return { success: true, animal: updatedAnimal };
  } catch (error) {
    console.error("Cannot edit Animal: ", e);
    return { success: false, message: "Server error." };
  }
};

const fetchAnimalImage = async (query) => {
  try {
    const imageRes = await fetch(
      `https://api.unsplash.com/photos/random?query=${query}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    );

    const imageData = await imageRes.json();
    return imageData.urls?.regular || null;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};


module.exports = {
  addAnimalToUser,
  getUserAnimals,
  removeAnimalForUser,
  updateAnimalDetailsForUser,
  fetchAnimalImage,
};

//dotenv
const dotenv = require("dotenv");
dotenv.config();
//mongoose
const mongoose = require("mongoose");
//express
const express = require("express");

const morgan = require("morgan");
const methodOverride = require("method-override");

//importing an img
const fs = require("fs");
const path = require("path");
const axios = require("axios");

//import animal model
const Animal = require("./models/animals.js");

const app = express();

/*---middleware--*/
//serves if you displaying images locally
app.use("/media", express.static(path.join(__dirname, "media")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

/*---Routes---*/
app.get("/", (req, res) => {
  res.render("homePage.ejs");
});

//display all Animals
app.get("/animals", async (req, res) => {
  const animals = await Animal.find({});
  res.render("animals/allAnimals.ejs", { animals });
});

//create a new animal page
app.get("/animal/new", (req, res) => {
  res.render("animals/newAnimal.ejs");
});

//Show pages
app.get("/animals/:animalId", async (req, res) => {
  const animalFound = await Animal.findById(req.params.animalId);
  res.render("animals/show.ejs", { animal: animalFound });
});

//delete animal
app.delete("/animals/:animalId", async (req, res) => {
  await Animal.findByIdAndDelete(req.params.animalId);
  res.redirect("/animals");
});

//edit the animal details
app.get("/animals/:animalId/edit", async (req, res) => {
  const foundAnimal = await Animal.findById(req.params.animalId);
  console.log(foundAnimal);
  res.render("animals/edit.ejs", { animal: foundAnimal });
});

//updating
app.put("/animals/:animalId", async (req, res) => {
  await Animal.findByIdAndUpdate(req.params.animalId, req.body);
  res.redirect(`/animals/${req.params.animalId}`);
});

//create the actual new animal and send it to mongodb
app.post("/animals", async (req, res) => {
  console.log(req.body);
  await Animal.create(req.body);
  res.redirect("/animals");
});

/*---Listening---*/
app.listen(process.env.PORT, async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDb Atlas");
  } catch (e) {
    console.error("A problem occured connecting", e);
  }
});

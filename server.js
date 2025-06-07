//dotenv
const dotenv = require("dotenv");
dotenv.config();

//mongoose
const mongoose = require("mongoose");

//express
const express = require("express");

//importing an img
const fs = require("fs");
const path = require("path");
const axios = require("axios");

//import animal model
const Animal = require("./models/animals.js");

const app = express();

/*---middleware--*/
//serves if you displaying images locally 
app.use('/media', express.static(path.join(__dirname, 'media')));

app.use(express.urlencoded({ extended: false }));

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
app.get("/animals/:id", async (req, res) => {
  const animalFound = await Animal.findById(req.params.id);
  res.render("animals/show.ejs", { animal: animalFound });
});

//create the actual new animal and send it to mongodb
app.post("/animals", async (req, res) => {
  console.log(req.body);
  const { name, animalClass, habitat, diet, img } = req.body;
  let savedImagePath = "";
  //Downloading img

  if (img && (img.startsWith('http://') || img.startsWith('https://'))) {
    try {
      const response = await axios.get(img, { responseType: "stream" });

      const fileName = `${Date.now()}-${path.basename(img)}`;
      console.log(fileName);
      const mediaDir = path.join(__dirname, 'media')
      const savePath = path.join(__dirname, "media", fileName);
      console.log(savePath);

      // Create the media folder if it doesn't exist
      if (!fs.existsSync(mediaDir)) {
        fs.mkdirSync(mediaDir);
      }

      const writer = fs.createWriteStream(savePath);
      response.data.pipe(writer);

      //waits for image to download
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      savedImagePath = `/media/${fileName}`;
    } catch (err) {
      console.error("Image download failed:", err.message);
      savedImagePath = '/media/default.jpg';
    }
  }

  //save to Mongodb
  const animal = new Animal({
    name,
    animalClass,
    habitat,
    diet,
    img: savedImagePath,
  });

  await animal.save();

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

//dotenv
const dotenv = require("dotenv");
dotenv.config();
//mongoose
const mongoose = require("mongoose");
//express
const express = require("express");
//manage sessions
const session = require("express-session");

const morgan = require("morgan");
const methodOverride = require("method-override");
const path = require("path");

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";
//auth router holds all the auth enpoints
const authController = require("./controllers/auth.js");

//import animal model
const Animal = require("./models/animals.js");

const app = express();

/*---middleware--*/
//serves if you displaying images locally
app.use("/media", express.static(path.join(__dirname, "media")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use("/auth", authController);

/*---Routes---*/
app.get("/", (req, res) => {
  res.render("loginPage.ejs");
});

app.get("/homePage", (req, res) => {
  res.render("homePage.ejs", {
    user: req.session.user,
  });
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

  //get image again from API
  const imageRes = await fetch(
    `https://api.unsplash.com/photos/random?query=${animalFound.name}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
  );

  const imageData = await imageRes.json();
  const imageUrl = imageData.urls?.regular || null;
  res.render("animals/show.ejs", { animal: animalFound, imageUrl });
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

//search for the animal
app.post("/searchItem", async (req, res) => {
  const animalName = req.body.name;
  const animalApi = process.env.API_KEY;
  const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
  const url = `https://api.api-ninjas.com/v1/animals?name=${animalName}`;

  try {
    const animalApiResponse = await fetch(url, {
      method: "GET",
      headers: {
        "X-Api-Key": animalApi,
      },
    });

    if (!animalApiResponse.ok) {
      const errorText = await animalApiResponse.text();
      return res.status(animalApiResponse.status).json({ error: errorText });
    }
    //Animal API
    const animalData = await animalApiResponse.json();
    console.log(animalData[0]);
    console.log(animalData[0].characteristics.type);

    //Image API
    const imageApiResponse = await fetch(
      `https://api.unsplash.com/photos/random?query=${animalName}&client_id=${unsplashAccessKey}`
    );
    const imageData = await imageApiResponse.json();
    const imageUrl = imageData.urls ? imageData.urls.regular : null;

    res.render("animals/foundAnimal.ejs", { data: animalData[0], imageUrl });
  } catch (e) {
    res.status(500).send("Error occurred: " + e.message);
  }
});

/*---Listening---*/
app.listen(port, async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDb Atlas");
  } catch (e) {
    console.error("A problem occured connecting", e);
  }
});

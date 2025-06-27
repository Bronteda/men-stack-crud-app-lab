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
//queries functions
const {
  addAnimalToUser,
  getUserAnimals,
  removeAnimalForUser,
  updateAnimalDetailsForUser,
  fetchAnimalImage,
} = require("./queries/queries.js");

const { isAuthenticated } = require("./middleware/requireLogin.js");


//import animal model
const Animal = require("./models/animals.js");
//importing user model
const User = require("./models/user.js");

const app = express();

let user = null;

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
app.use("/animals", isAuthenticated);

/*---Routes---*/
app.get("/", (req, res) => {
  res.render("loginPage.ejs");
});

app.get("/homePage", (req, res) => {
  if (!req.session.user._id) {
    // Redirect or handle unauthenticated access
    return res.redirect("/"); // or render a message
  }

  res.render("homePage.ejs", { user: req.session.user});
});

//display all Animals
app.get("/animals", async (req, res) => {
  //filter animals by user
  const userAnimals = await getUserAnimals(req.session.user._id);
  res.render("animals/allAnimals.ejs", { animals: userAnimals });
});

//create a new animal page
app.get("/animal/new", (req, res) => {
  res.render("animals/newAnimal.ejs");
});

//Show pages
app.get("/animals/:animalId", async (req, res) => {
  const animalFound = await Animal.findById(req.params.animalId);

  const imageUrl = await fetchAnimalImage(animalFound.name);
  res.render("animals/show.ejs", { animal: animalFound, imageUrl });
});

//delete animal
app.delete("/animals/:animalId", async (req, res) => {
  const result = await removeAnimalForUser(
    req.session.user._id,
    req.params.animalId
  );

  if (!result.success) {
    return res.status(403).send(result.message);
  }

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
  const result = await updateAnimalDetailsForUser(
    req.session.user._id,
    req.params.animalId,
    req.body
  );

  if (!result.success) {
    return res.status(403).send(result.message);
  }

  res.redirect(`/animals/${req.params.animalId}`);
});

//create the actual new animal and send it to mongodb
app.post("/animals", async (req, res) => {
  const userId = req.session.user._id;
  const newAnimal = await Animal.create(req.body);

  try {
    await addAnimalToUser(userId, newAnimal._id);
    console.log(`Added animal ${newAnimal._id} to user ${userId}`);
  } catch (err) {
    console.error("Failed to add animal to user:", err);
  }

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

    // await mongoose.disconnect();
    // console.log("Disconnected from MongoDB");
    // process.exit();
  } catch (e) {
    console.error("A problem occured connecting", e);
  }
});

const Recipe = require("./model/recipeModel");
const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@recipe-app.g1u3x3i.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DB_APPNAME}`
  )
  .then(() => {
    console.log("Database connected successfully");
  });

const recipes = JSON.parse(
  fs.readFileSync(`${__dirname}/data/recipes.json`, "utf-8")
);

console.log(recipes);

const importData = async () => {
  try {
    await Recipe.create(recipes);
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "--import") {
  importData();
}

module.exports = recipes;

const express = require("express");
const recipeController = require("../controller/recipeController");
const app = express.Router();

app.get("/", recipeController.getAllRecipes);
app.get("/:id", recipeController.getRecipeById);
app.patch("/:id", recipeController.updateRecipeById);
app.delete("/:id", recipeController.deleteRecipeById);

module.exports = app;

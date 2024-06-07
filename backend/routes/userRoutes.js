const express = require("express");
const app = express.Router();
const userController = require("../controller/userController");

app.get(
  "/",
  userController.protectTo,
  // userController.isLoggedIn,
  // userController.restrictedTo("user"),
  userController.getAllUsers
);
app.post("/signup", userController.signup);
app.get("/login", userController.login);
app.get("/logout", userController.logout);
app.post(
  "/add-favorite-recipe/:id",
  userController.protectTo,
  userController.addFavRecipe
);

module.exports = app;

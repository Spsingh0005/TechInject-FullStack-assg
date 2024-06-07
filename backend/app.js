const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const userroutes = require("./routes/userRoutes");
const reciperoutes = require("./routes/recipeRoutes");

app.use("/api/users", userroutes);
app.use("/api/recipes", reciperoutes);

module.exports = app;

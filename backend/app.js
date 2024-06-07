const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const userroutes = require("./routes/userRoutes");

app.use("/api/users", userroutes);

module.exports = app;

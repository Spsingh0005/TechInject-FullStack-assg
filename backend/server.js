const { default: mongoose } = require("mongoose");
const app = require("./app");
require("dotenv").config();

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@recipe-app.g1u3x3i.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DB_APPNAME}`
  )
  .then(() => {
    console.log("Database connected successfully");
  });

app.listen(3000, () => {
  console.log(`App is running on port 3000`);
});

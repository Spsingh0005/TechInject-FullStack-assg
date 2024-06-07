const mongoose = require("mongoose");

// Define the Recipe schema
const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      name: String,
      quantity: String,
    },
  ],
  steps: [
    {
      stepNumber: Number,
      instruction: String,
    },
  ],
  prepTime: Number, // in minutes
  cookTime: Number, // in minutes
  servings: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Recipe model
const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;

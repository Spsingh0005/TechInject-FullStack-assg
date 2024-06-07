const Recipe = require("../model/recipeModel");

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json({
      status: "success",
      result: recipes.length,
      data: {
        recipes,
      },
    });
  } catch (error) {
    res.json(error);
  }
};

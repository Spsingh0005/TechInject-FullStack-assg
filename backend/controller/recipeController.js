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

exports.getRecipeById = async (req, res) => {
  const { id } = req.params;

  try {
    const recipe = await Recipe.findById(id);
    res.status(200).json({
      status: "success",

      data: {
        recipe,
      },
    });
  } catch (error) {
    res.json(error);
  }
};

exports.updateRecipeById = async (req, res) => {
  const { id } = req.params;

  const { title, description, ingredients } = req.body;
  console.log(title);
  console.log(description);
  console.log(ingredients);

  try {
    await Recipe.findByIdAndUpdate(id, {
      title,
      description,
      ingredients,
    });
    res.status(200).json({
      status: "success",
      message: "Recipe updated successfully",
    });
  } catch (error) {
    res.json(error);
  }
};

exports.deleteRecipeById = async (req, res) => {
  const { id } = req.params;

  try {
    await Recipe.findByIdAndDelete(id);
    res.status(200).json({
      status: "success",

      message: "Recipe deleted successfully",
    });
  } catch (error) {
    res.json(error);
  }
};

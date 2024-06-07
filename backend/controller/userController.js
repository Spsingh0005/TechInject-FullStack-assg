const Recipe = require("../model/recipeModel");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
// Generating token to authenticate

const genToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};

const createToken = async (userId, user, res) => {
  try {
    const token = genToken(userId);

    // Saving token into cookie
    const cookieOptions = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie("jwt", token, cookieOptions);

    res.status(200).json({
      status: "success",
      token,
      user,
    });
  } catch (error) {
    res.json({ error });
  }
};

exports.protectTo = async (req, res, next) => {
  let token;

  if (req.headers.cookie) {
    // console.log("inside request header block");

    token = req.headers.cookie.split("=")[1];
    // console.log(token);
  }

  if (!token) {
    res.json({
      message: "Please log in to get access",
    });
  } else {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) return res.json({ message: "Please log in to get access" });
    const { userId } = decoded;
    const user = await User.findById(userId);

    if (user) {
      res.locals.user = user;
      // console.log(user);
      next();
    }
  }
};

exports.restrictedTo = (...roles) => {
  return function (req, res, next) {
    if (!roles.includes(res.locals.user.role)) {
      return res.json({ message: "You are not authorized to this action" });
    }
    next();
  };
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      result: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    res.json(error);
  }
};
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = new User({ email, username, password });
    await user.save();
    res.status(200).json({
      result: "success",
      data: { user },
    });
  } catch (error) {
    res.json({ error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // if email or password is not provided then return
    if (!email || !password) {
      res.json({
        message: "Please provide both email and password",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      if (await user.matchPassword(password)) {
        createToken(user._id, user, res);
      } else {
        res.json({
          status: "Login failed",
          message: "Either email or password is wrong",
        });
      }
    }
  } catch (error) {
    res.json({
      status: "Failed",
      error,
    });
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    message: "Logout successfully",
  });
};

// exports.isLoggedIn = async (req, res, next) => {
//   let token;
//   if (req.headers.cookie) {
//     console.log("inside request header block");
//     token = req.headers.cookie.split("=")[1];
//   }

//   if (!token) {
//     res.json({
//       message: "Please log in to get access",
//     });
//   } else {
//     const decoded = jwt.verify(token, process.env.SECRET_KEY);
//     if (!decoded) return res.json({ message: "Please log in to get access" });
//     const { userId } = decoded;
//     const user = await User.findById(userId);

//     if (user) {
//       res.locals.user = user;
//       next();
//     }
//   }
// };

// Working of add Favorite function
// 1. Get userId and user favorite array from res.locals.user .
// 2. get recipe id from params.
// 3. Check if recipe id is found.
// 4. if recipe id is provided, then go to validate it from user favorite array.
// 5. Check if user favourite array has lenght, then check to match recipe id.
// 5.1 Filter recipe_id from favorite array.
// 5.2. if recipeId is found, then throw message : recipe already chosen.
// 5.3. if recipeId is not matched, then validate recipe from database before save.
// 6. if user favourite array is empty, then validate recipe from database before save.
// 6.1 If recipe is valid, then save it.
// 6.2 If recipe is not valid, then throw message : Invalid recipe Id.

exports.addFavRecipe = async (req, res) => {
  try {
    // 1. Getting userId from res.locals
    const { id } = res.locals.user;
    console.log("1. User id is " + id);
    //2. Getting recipe id from request params
    const recipeId = req.params.id;

    console.log("2. Recipe id is " + recipeId);

    //3. Check if recipeId is found.
    if (recipeId) {
      console.log("3. recipeId is provided");

      //4. if recipeId is provided, checking it to compare from user favorite array.
      console.log(
        "4. Checking for user favourite array. " +
          res.locals.user.favorites.length
      );
      //5. Check if user favourite array has lenght > 0
      if (res.locals.user.favorites.length > 0) {
        console.log("5. User Favourite array is not empty.");
        //5.1. Filter recipe_id from user favourite array.
        const isFavorite = res.locals.user.favorites.some((item) => {
          console.log(item);
          if (item.recipe_id === recipeId) {
            return true;
          } else {
            return false;
          }
        });
        console.log("Value of isFavorite is " + isFavorite);
        if (isFavorite) {
          return res.json({
            message: "Recipe already chosen in favorite array.",
          });
        }
        // 5.3 if Recipe is not found in the user favorite array, then save it before validating from DB.
        const recipe = await Recipe.findById(recipeId);
        if (recipe) {
          const newFav = [
            { recipe_id: recipeId },
            ...res.locals.user.favorites,
          ];

          await User.findByIdAndUpdate(id, {
            favorites: newFav,
          });

          res.json({
            message: "Recipe added successfully",
          });
        }
      } else {
        // 6. if user favourite array is empty then validating recipe from DB before saving
        console.log("6. User Favourite array is empty.");
        const recipe = await Recipe.findById(recipeId);

        if (recipe) {
          console.log("6.1 if the recipe is validate from DB.");
          //6.1 If Recipe is valid
          await User.findByIdAndUpdate(id, {
            favorites: { recipe_id: recipeId },
          });
          res.json({
            message: "Recipe added successfully",
          });
        } else {
          // 6.2 If recipe is invalid, then throw an error message: Recipe Id is invalid
          res.json({
            message: "recipe Id is invalid",
          });
        }
      }
    }
  } catch (error) {
    res.json({
      message: { error },
    });
  }
};

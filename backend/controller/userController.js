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
    console.log("inside request header block");
    token = req.headers.cookie.split("=")[1];
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

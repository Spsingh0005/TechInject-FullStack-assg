const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  active: {
    type: Boolean,
    default: true,
  },
});

// Using middleware to encrypt password before saving to the database
userSchema.pre("save", async function (next) {
  try {
    // Creating salt
    const salt = await bcrypt.genSalt(12);

    // Creating password with salt
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    return next(error);
  }

  next();
});

// Compare password at the time of login

userSchema.methods.matchPassword = async function (plaintextpassword) {
  try {
    console.log(
      "inside comparision function try block " +
        plaintextpassword +
        " " +
        this.password
    );
    console.log(await bcrypt.compare(plaintextpassword, this.password));
    return await bcrypt.compare(plaintextpassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;

const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const generateToken = require("../middlewares/generateToken");

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      res
        .status(400)
        .json({
          status: "fail",
          message: "User not found. Please Sign Up first!",
        });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    const accessToken = await generateToken(user._id);
    res.cookie("accessToken", accessToken, {
      sameSite: "strict",
      path: "/",
      expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });
    if (user.email === email && isMatch) {
      res.status(201).json({
        status: "true",
        message: "Successfully logged In!",
      });
    }
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

const signUp = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, role } = req.body;
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      res
        .status(409)
        .json({ status: "fail", message: "Email is already in use!" });
    } else {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new UserModel({
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        password: hashedPassword,
        role: role,
      });
      await newUser.save();
      const user = await UserModel.findOne({ email: email });
      const id = user._id;
      const accessToken = await generateToken(id);
      res.cookie("accessToken", accessToken, {
        sameSite: "strict",
        path: "/",
        expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      });
      res.status(201).json({
        status: "true",
        message: "Successfully registered!",
      });
    }
  } catch (error) {
    res.status(500).json({ status: "fail", message: error });
  }
};
const logOut = async (req, res) => {
  return res
    .clearCookie("accessToken")
    .status(200)
    .json({ status: "success", message: "Successfully logged out!" });
};

module.exports = { signIn, signUp, logOut };

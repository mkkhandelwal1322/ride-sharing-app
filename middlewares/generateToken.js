const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");

const generateToken = async (id) => {
  try {
    const user = await UserModel.findOne({ _id: id });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    req
      .status(500)
      .json({ status: "fail", message: "Token cannot be generated!" });
  }
};

module.exports = generateToken;

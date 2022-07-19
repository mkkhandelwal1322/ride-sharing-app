const express = require("express");
const getAuthToken = require("../middlewares/getAuthToken");
const UserModel = require("../models/user");

const verifySignInUser = async (req, res, next) => {
  try {
    if (req.cookies.accessToken) {
      const verifiedToken = await getAuthToken(req.cookies.accessToken);
      req.decoded = verifiedToken;
      next();
    } else {
      res.status(400).json({ status: "fail", message: "Please Log In first!" });
    }
  } catch (error) {
    res.status(500).json({ status: "fail", message: "No cookies found!" });
  }
};

const isRider = async (req, res, next) => {
  const user = await UserModel.findById(req.decoded);
  if (user.role === "rider") {
    next();
  } else {
    res
      .status(403)
      .json({ status: "fail", message: "User is not registered as Rider!" });
  }
};

const isDriver = async (req, res, next) => {
  const user = await UserModel.findById(req.decoded);
  if (user.role === "driver") {
    next();
  } else {
    res
      .status(403)
      .json({ status: "fail", message: "User is not registered as Driver!" });
  }
};

module.exports = { verifySignInUser, isRider, isDriver };

const express = require("express");
const { verify } = require("jsonwebtoken");
const router = express();
const UserController = require("../controllers/userController");
const { verifySignInUser } = require("../middlewares/auth");

router.get("/check", (req, res) => {
  res.send("Clear!");
});
router.post("/signup", UserController.signUp);
router.post("/signin", UserController.signIn);
router.get("/logout", verifySignInUser, UserController.logOut);

router.get("/ride/request", verifySignInUser, (req, res) => {
  res.send("Working Fine!");
});

module.exports = router;

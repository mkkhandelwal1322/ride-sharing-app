const express = require("express");
const router = express();
const TripController = require("../controllers/tripController");
const { verifySignInUser, isRider, isDriver } = require("../middlewares/auth");

router.get("/check", (req, res) => {
  res.send("Clear!");
});
router.get("/riders", TripController.getRiders);
router.get("/drivers", TripController.getDrivers);
router.post(
  "/requesttrip",
  verifySignInUser,
  isRider,
  TripController.requestTrip
);
router.get("/mytrips", verifySignInUser, TripController.getTrips);
router.get(
  "/nearesttrips",
  verifySignInUser,
  isDriver,
  TripController.getNearestTrips
);
router.post(
  "/accepttrip/:tripID",
  verifySignInUser,
  isDriver,
  TripController.acceptTrip
);

module.exports = router;

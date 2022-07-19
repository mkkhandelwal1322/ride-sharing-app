const UserModel = require("../models/user");
const TripModel = require("../models/trip");

const getRiders = async (req, res) => {
  try {
    const riders = await UserModel.find({ role: { $eq: "rider" } });
    res.status(200).json({ status: "success", riders: riders });
  } catch (error) {
    res
      .status(400)
      .json({ status: "fail", message: "Unable to fetch Riders!" });
  }
};

const getDrivers = async (req, res) => {
  try {
    const drivers = await UserModel.find({ role: { $eq: "driver" } });
    res.status(200).json({ status: "success", drivers: drivers });
  } catch (error) {
    res
      .status(400)
      .json({ status: "fail", message: "Unable to fetch Riders!" });
  }
};

const generateTripFare = () => {
  return Math.floor(Math.random() * (300 - 100 + 1) + 100);
};

const requestTrip = async (req, res) => {
  try {
    const id = req.decoded;
    const user = await UserModel.findOne({ _id: id });
    const tripFare = generateTripFare();
    const { pickUpLocation, dropLocation } = req.body;
    const newTrip = new TripModel({
      pickUpLocation: pickUpLocation,
      dropLocation: dropLocation,
      riderID: id,
      tripFare: tripFare,
    });
    await newTrip.save();
    await user.updateOne({ $push: { riderTrips: newTrip._id } });
    res.status(201).json({
      status: "success",
      message: "Trip requested!",
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

const getNearestTrips = async (req, res) => {
  const { currentLocation } = req.body;
  const nearestTrips = await TripModel.find({
    pickUpLocation: { $eq: currentLocation },
    tripStatus: { $eq: "Customer Requested" },
  });
  res.status(200).json({ status: "success", nearestTrips: nearestTrips });
};

const acceptTrip = async (req, res) => {
  try {
    const tripID = req.params.tripID;
    const id = req.decoded;
    const user = await UserModel.findOne({ _id: id });
    await TripModel.findOneAndUpdate(
      { _id: tripID },
      { $set: { tripStatus: "Driver Accepted" } }
    );
    await TripModel.findOneAndUpdate(
      { _id: tripID },
      { $set: { driverID: id } }
    );
    await user.updateOne({ $push: { driverTrips: tripID } });
    await res.status(200).json({
      status: "success",
      message: "Trip Accepted!",
    });
    setTimeout(async () => {
      await TripModel.findOneAndUpdate(
        { _id: tripID },
        { $set: { tripStatus: "Trip Started" } }
      );
    }, 20000);
    setTimeout(async () => {
      await TripModel.findOneAndUpdate(
        { _id: tripID },
        { $set: { tripStatus: "Trip Completed", fareCollected: true } }
      );
    }, 60000);
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

const getTrips = async (req, res) => {
  try {
    const id = req.decoded;
    const user = await UserModel.findOne(
      { _id: id },
      { driverTrips: 1, riderTrips: 1, role: 1 }
    );
    if (user.role === "driver") {
      var trip = await user.populate("driverTrips");
      res.status(200).json({ status: "success", trip });
    } else {
      var trip = await user.populate("riderTrips");
      res.status(200).json({ status: "success", trip });
    }
  } catch (error) {
    res.status(400).json({ status: "fail", message: error });
  }
};

module.exports = {
  getRiders,
  getDrivers,
  requestTrip,
  acceptTrip,
  getNearestTrips,
  getTrips,
};

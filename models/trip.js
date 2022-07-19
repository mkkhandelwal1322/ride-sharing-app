const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    tripDate: {
      type: Date,
      default: new Date(),
      required: true,
    },
    driverID: {
      type: String,
    },
    riderID: {
      type: String,
    },
    tripStatus: {
      type: String,
      enum: [
        "Customer Requested",
        "Driver Accepted",
        "Trip Started",
        "Trip Completed",
      ],
      default: "Customer Requested",
    },
    pickUpLocation: {
      type: String,
      required: true,
    },
    dropLocation: {
      type: String,
      required: true,
    },
    tripFare: {
      type: Number,
    },
    fareCollected: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const TripModel = mongoose.model("Trip", tripSchema);

module.exports = TripModel;

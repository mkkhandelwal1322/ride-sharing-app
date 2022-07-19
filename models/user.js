const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["rider", "driver"],
      default: "rider",
    },
    phoneNumber: { type: Number, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    riderTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }],
    driverTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;

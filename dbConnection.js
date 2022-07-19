const mongoose = require("mongoose");

const connectDb = async (DATABASE_URL) => {
  try {
    const DB_OPTIONS = {
      dbName: "ride-sharing",
    };
    await mongoose.connect(DATABASE_URL, DB_OPTIONS, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`Connecting to: https://localhost:27017`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;

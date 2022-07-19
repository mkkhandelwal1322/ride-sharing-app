const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDb = require("./dbConnection");
const userRoute = require("./routes/userRoute");
const tripRoute = require("./routes/tripRoute");
dotenv.config();
const app = express();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
connectDb(DATABASE_URL);

app.get("/", (req, res) => {
  res.send("<h2>Welcome to Ride Sharing App!</h2>");
});

app.use("/user", userRoute);
app.use("/trip", tripRoute);

app.listen(PORT, () => {
  console.log(`Server listening on: https://localhost:${PORT}`);
});

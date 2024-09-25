const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDb = require("./db");
const User = require("./userModel");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//allows inflow of json data
app.use(express.json());

//health check
app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "server up and running",
  });
});

app.post("/auth/register", async (req, res, next) => {
  //functionality for user registration
  try {
    //hash password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    const user = await User.create({
      email: req.body.email,
      name: req.body.name,
      password,
    });
    res.status(200).json({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/auth/login", async (req, res, next) => {
  //functionality for user sign in
  try {
    //check user availability and compare password
    const existingUser = await User.findOne({ email: req.body.email });
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );
    if (existingUser || !isPasswordMatch) {
      return next();
    }
    res.status(200).json({
      name: existingUser.name,
      email: existingUser.email,
    });
  } catch (error) {
    console.log(error);
  }
});

//general error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    message: "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
  connectDb();
});

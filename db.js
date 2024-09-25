const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect();
    console.log("connected to database");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;

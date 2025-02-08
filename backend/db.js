const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MDB;

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("connected to mongo successfully");
  } catch (error) {
    console.log(error, "not working");
  }
};
module.exports = connectToMongo;

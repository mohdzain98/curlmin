const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserCountsSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  urlCount: { type: Number, default: 0 },
  qrCount: { type: Number, default: 0 },
  barcodeCount: { type: Number, default: 0 },
  curltagCount: { type: Number, default: 0 },
});

const UserCounts = mongoose.model("UserCounts", UserCountsSchema);

module.exports = UserCounts;

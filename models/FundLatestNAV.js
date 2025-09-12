const mongoose = require("mongoose");

const latestNavSchema = new mongoose.Schema({
  schemeCode: { type: Number, required: true, unique: true },
  nav: { type: Number, required: true },
  date: { type: String, required: true }, 
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("FundLatestNav", latestNavSchema);

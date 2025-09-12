const mongoose = require("mongoose");

const fundSchema = new mongoose.Schema({
  schemeCode: { type: Number, required: true, unique: true },
  schemeName: String,
  isinGrowth: String,
  isinDivReinvestment: String,
  fundHouse: String,
  schemeType: String,
  schemeCategory: String,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Fund", fundSchema);

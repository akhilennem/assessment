const mongoose = require("mongoose");

const navHistorySchema = new mongoose.Schema({
  schemeCode: { type: Number, required: true },
  nav: { type: Number, required: true },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

navHistorySchema.index({ schemeCode: 1, date: -1 });

module.exports = mongoose.model("FundNavHistory", navHistorySchema);

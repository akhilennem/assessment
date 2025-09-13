const mongoose = require("mongoose");

const portfolioSchema =new mongoose.Schema({
  userId: 
  { type: String,
     ref: "User", required: true },
  schemeCode: { type: Number, 
    required: true },
  schemeName:{type:String},
  units: { type: Number,
     required: true, 
     min: 0 },
  purchaseNav: { type: Number,
     required: true, 
     },
  purchaseDate: { 
    type: Date, 
    default: Date.now 
},
  createdAt: { type: Date, 
    default: Date.now 
},
});

portfolioSchema.index({ userId: 1, schemeCode: 1 }, { unique: true });

module.exports = mongoose.model("Portfolio", portfolioSchema);

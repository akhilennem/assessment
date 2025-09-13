const Portfolio = require("../models/Portfolio");
const Fund = require("../models/Fund");
const FundLatestNav = require("../models/FundLatestNAV");
const FundNavHistory = require("../models/FundNavHistory");

exports.addFund = async (req, res) => {
  try {
    const { schemeCode, units,purchaseNav } = req.body;
    const userId = req.user.id; 

    const fund = await Fund.findOne({ schemeCode });
    
    let schemeName=fund.schemeName;
    if (!fund) {
      return res.status(400).json({ success: false, message: "Invalid schemeCode" });
    }

    if (!units<0) {
      return res.status(400).json({ success: false, message: "units cannot be a negative number" });
    }
    const portfolio = await Portfolio.create({
      userId,
      schemeCode,
      schemeName,
      units,
      purchaseDate: new Date(),
      createdAt: new Date(),
      purchaseNav
    });

    res.json({
      success: true,
      message: "Fund added to portfolio successfully",
      portfolio
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getPortfolioValue = async (req, res) => {
  try {
    const userId = req.user.id;
    const holdings = await Portfolio.find({ userId });

    let totalInvestment = 0;
    let currentValue = 0;
    const holdingDetails = [];

    for (const h of holdings) {
      const fund = await Fund.findOne({ schemeCode: h.schemeCode });
      const latestNav = await FundLatestNav.findOne({ schemeCode: h.schemeCode });

      if (!fund || !latestNav) continue;

      const investedValue = h.units * h.purchaseNav; 
      const currentVal = h.units * latestNav.nav;

      totalInvestment += investedValue;
      currentValue += currentVal;

      holdingDetails.push({
        schemeCode: h.schemeCode,
        schemeName: fund.schemeName,
        units: h.units,
        currentNav: latestNav.nav,
        currentValue: currentVal,
        investedValue,
        profitLoss: currentVal - investedValue
      });
    }

    return res.json({
      success: true,
      data: {
        totalInvestment,
        currentValue,
        profitLoss: currentValue - totalInvestment,
        profitLossPercent: ((currentValue - totalInvestment) / totalInvestment) * 100,
        asOn: new Date().toLocaleDateString("en-GB"), 
        holdings: holdingDetails
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};




exports.getPortfolioHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const holdings = await Portfolio.find({ userId });

    if (!holdings.length) {
      return res.json({ success: true, data: [] });
    }

    const schemeCodes = holdings.map(h => h.schemeCode);

    const historyRecords = await FundNavHistory.find({
      schemeCode: { $in: schemeCodes }
    }).sort({ date: 1 });

    const historyMap = {};

    for (const record of historyRecords) {
      const holding = holdings.find(h => h.schemeCode === record.schemeCode);
      if (!holding) continue;

      const investedValue = holding.units * holding.purchaseNav;

      const currentValue = holding.units * record.nav;

      if (!historyMap[record.date]) {
        historyMap[record.date] = {
          date: record.date,
          totalValue: 0,
          investedValue: 0
        };
      }

      historyMap[record.date].totalValue += currentValue;
      historyMap[record.date].investedValue += investedValue;
    }

    const history = Object.values(historyMap).map(entry => ({
      date: entry.date,
      totalValue: entry.totalValue,
      investedValue: entry.investedValue,
      profitLoss: entry.totalValue - entry.investedValue
    }));

    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getPortfolioList = async (req, res) => {
  try {
    const userId = req.user.id;

    const holdings = await Portfolio.aggregate([
      {
        $match: { userId: userId }
      },
      {
        $lookup: {
          from: "funds", 
          localField: "schemeCode",
          foreignField: "schemeCode",
          as: "fund"
        }
      },
      { $unwind: { path: "$fund", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "fundlatestnavs", 
          localField: "schemeCode",
          foreignField: "schemeCode",
          as: "latestNav"
        }
      },
      { $unwind: { path: "$latestNav", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          schemeName: { $ifNull: ["$fund.schemeName", "Unknown"] },
          currentNav: "$latestNav.nav",
          currentValue: {
            $cond: {
              if: { $ne: ["$latestNav.nav", null] },
              then: { $multiply: ["$units", "$latestNav.nav"] },
              else: null
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          schemeCode: 1,
          schemeName: 1,
          units: 1,
          currentNav: 1,
          currentValue: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalHoldings: holdings.length,
        holdings
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.removeFund = async (req, res) => {
  try {
    const userId = req.user.id;
    const { schemeCode } = req.params;

    await Portfolio.deleteOne({ userId, schemeCode });

    res.json({ success: true, message: "Fund removed from portfolio successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

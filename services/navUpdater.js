const axios = require("axios");
const Portfolio = require("../models/Portfolio");
const FundLatestNav = require("../models/FundLatestNAV");
const FundNavHistory = require("../models/FundNavHistory");


exports.updateNav = async () => {
  console.log("Starting daily NAV update...");
  try {
    const portfolioSchemes = await Portfolio.distinct("schemeCode");

    for (const schemeCode of portfolioSchemes) {
      const { data } = await axios.get(`https://api.mfapi.in/mf/${schemeCode}/latest`);

      if (!data || !data.data || !data.data[0]) {
        console.log(`No NAV found for schemeCode: ${schemeCode}`);
        continue;
      }

      const latest = data.data[0];
      const nav = parseFloat(latest.nav);
      const date = latest.date;

      await FundLatestNav.updateOne(
        { schemeCode },
        { schemeCode, nav, date, updatedAt: new Date() },
        { upsert: true }
      );

      await FundNavHistory.create({
        schemeCode,
        nav,
        date,
        createdAt: new Date()
      });

      console.log(`Updated NAV for ${schemeCode}: ${nav} on ${date}`);
    }

    console.log("NAV update completed");
  } catch (err) {
    console.error("NAV update failed:", err.message);
  }
}



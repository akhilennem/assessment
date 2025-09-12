const axios = require("axios");
const Fund = require("./models/Fund")
const sendAlerts = require('./utility/sendAlert')

async function fetchWithRetry(url, retries = 5, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await axios.get(url, { timeout: 10000 });
      return res.data;
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`Fetch failed (attempt ${i + 1}), retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
}

function sendAlert(message) {
 sendAlerts.sendAlert(message);
}

async function saveFunds() {
  console.log(`[${new Date().toISOString()}] Starting fund list update...`);

  try {
    const data = await fetchWithRetry("https://api.mfapi.in/mf");

    console.log(`Fetched ${data.length} funds. Saving to DB...`);

    let successCount = 0;
    let failCount = 0;
    let failed=[]

    for (const fund of data) {
      try {
        await Fund.updateOne(
          { schemeCode: fund.schemeCode },
          {
            schemeCode: fund.schemeCode,
            schemeName: fund.schemeName,
            isinGrowth: fund.isinGrowth,
            isinDivReinvestment: fund.isinDivReinvestment,
            fundHouse: fund.fundHouse,
            schemeType: fund.schemeType,
            schemeCategory: fund.schemeCategory,
            updatedAt: new Date()
          },
          { upsert: true }
        );
        successCount++;
      } catch (err) {
        failCount++;
        //schemeCode of critical funds
        if (["152075", "118834"].includes(String(fund.schemeCode))) 
          {
          failed.push({
                        schemeCode:fund.schemeCode,
                        schemeName:fund.schemeName
                      })
          sendAlert(`Critical fund ${failed} failed to update!`);
        }
      }
    }
    console.log(`Fund update complete: ${successCount} saved, ${failCount} failed`);
  } catch (err) {
    console.error("Error fetching fund list:", err.message);
    sendAlert("Fund list fetch failed!");
  }
}

saveFunds();
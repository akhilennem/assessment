const router = require("express").Router();
const portfolioController = require("../controllers/portfolioController");
const rateLimit = require("express-rate-limit");
const portfolioLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {message:"Too many portfolio updates. Try again later."}
});

router.post("/add",  portfolioLimiter, portfolioController.addFund);
router.get("/get", portfolioController.getPortfolioValue);
router.get("/history",portfolioController.getPortfolioHistory);
router.get("/list", portfolioController.getPortfolioList);
router.delete("/remove/:schemeCode", portfolioLimiter, portfolioController.removeFund);

module.exports = router;

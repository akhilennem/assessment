const router = require("express").Router();
const portfolioController = require("../controllers/portfolioController");
const authMiddleware = require('../middleware/authMiddleware');
const rateLimit = require("express-rate-limit");
const portfolioLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {message:"Too many portfolio updates. Try again later."}
});

router.post("/add", authMiddleware.authenticate, portfolioLimiter, portfolioController.addFund);
router.get("/get", authMiddleware.authenticate,portfolioController.getPortfolioValue);
router.get("/history", authMiddleware.authenticate,portfolioController.getPortfolioHistory);
router.get("/list", authMiddleware.authenticate,portfolioController.getPortfolioList);
router.delete("/remove/:schemeCode", authMiddleware.authenticate, portfolioLimiter, portfolioController.removeFund);

module.exports = router;

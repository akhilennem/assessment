const router = require("express").Router();
const adminController = require("../controllers/adminController");

router.get("/users", adminController.listAllUsers);
router.get("/portfolios", adminController.listAllPortfolios);
router.get("/popular-funds",adminController.getPopularFunds);

module.exports = router;

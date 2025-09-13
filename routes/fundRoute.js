const router = require("express").Router();
const authController = require("../controllers/fundController");
const authMiddleware = require('../middleware/authMiddleware');

router.get('/get-funds',authController.ListFunds);
router.get('/nav-history',authController.NavHistory);

module.exports = router;

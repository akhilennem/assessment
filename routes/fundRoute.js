const router = require("express").Router();
const authController = require("../controllers/fundController");
const authMiddleware = require('../middleware/authMiddleware');

router.get('/get-funds',authMiddleware.authenticate,authController.ListFunds);
router.get('/nav-history',authMiddleware.authenticate,authController.NavHistory);

module.exports = router;

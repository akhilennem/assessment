const router = require("express").Router();
const authController = require("../controllers/authController");
const authMiddleware = require('../middleware/authMiddleware');

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post('/test',authMiddleware.authenticate,authMiddleware.authorizeAdmin,authController.test);

module.exports = router;

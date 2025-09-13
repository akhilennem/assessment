require('dotenv').config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userValidator = require('../validators/UserValidator')

exports.signup = async (req, res) => {
  try {

    const { error, value } = userValidator.validate(req.body);
    if(error){
      return res.json({success:false,error:error.details})
    }
    let { name, email, password,role } = req.body;

    const exist = await User.findOne({ email });
    if (exist) 
        return res.status(400).json({ success: false, message: "Email already exists" });
    password = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password,role });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      success: true,
      message: "User registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
   return res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Email not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ success: false, message: "Invalid credentials" });
    console.log(process.env.JWT_SECRET)
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: 36000 });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};






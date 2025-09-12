require('dotenv').config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    let { name, email, password,role } = req.body;

    if(!email || !name || !password || role){
      return res.status(200).json({success:false, message:'Email, name, password and role are mandatory'})
    }


    const exist = await User.findOne({ email });
    if (exist) 
        return res.status(400).json({ success: false, message: "Email already exists" });

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if(!passwordRegex.test(password)){
       return res.status(200).json({ success: false, message: 'invalid mail format' });
      }
      if(!emailRegex.test(email)){
       return res.status(200).json({ success: false, message: 'password must be minimum 8 characters  with atleast one uppercase,lowercase and a special character' });
      }
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


const axios = require("axios");
const Portfolio = require("../models/Portfolio");
const FundLatestNav = require("../models/FundLatestNAV");
const FundNavHistory = require("../models/FundNavHistory");
exports.test = async (req, res) => {
 try {
    const portfolioSchemes = await Portfolio.distinct("schemeCode");

    for (const schemeCode of portfolioSchemes) {
      const { data } = await axios.get(`https://api.mfapi.in/mf/${schemeCode}/latest`);

      if (!data || !data.data || !data.data[0]) {
        console.warn(`No NAV found for schemeCode: ${schemeCode}`);
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

    console.log("NAV update completed successfully");
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



require('dotenv').config();
const express   =  require('express')
const mongoose  =  require('mongoose')
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const cron = require('node-cron')
const  updateNavCron  =  require("./services/navUpdater");  
const authRoute =  require('./routes/authRoute')
const portfolioRoute =  require('./routes/portfolioRoute')
const fundRoute =  require('./routes/fundRoute')
const app = express();
app.use(express.json())

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 100,
  message: {message: "Too many requests. Try again after sometime."}
});

app.use(mongoSanitize()); 
app.use(helmet());
app.use(apiLimiter)
app.use('/auth',authRoute)
app.use('/portfolio',portfolioRoute)
app.use('/funds',fundRoute)

app.listen(8000,()=>{
    console.log('app running on port 8000')
})


mongoose.connect((process.env.DB_URL)).then(()=>{
    console.log('Db Connected Succesfully')
})


function initCron() {
  cron.schedule("0 0 * * *", () => {
    updateNavCron.updateNav()
});
}

initCron()
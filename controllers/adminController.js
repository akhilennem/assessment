const Users = require('../models/User')
const Portfolios = require('../models/Portfolio')


exports.listAllUsers = async(req,res)=>{
    try {
        
        const response = await Users.find({},{name:1,email:1,role:1})
        return res.json({success:true,message:'users fetched successfully',data:response})

    } catch (error) {
        return res.status(500).json({success:false,error:error.message})
    }
}

exports.listAllPortfolios = async(req,res)=>{
    try {
        
        const response = await Portfolios.find({}).select("-createdAt")
        return res.json({success:true,message:'portfolios fetched successfully',data:response})

    } catch (error) {
        return res.status(500).json({success:false,error:error.message})
    }
}


exports.getPopularFunds = async(req,res)=>{
    try {
        const pipeline = [{
            $group:{
                _id:"$schemeCode",
                schemeName:{$first:"$schemeName"},
                totalUnits:{$sum:"$units"},
                totalInvestors:{"$addToSet":"$userId"}
            }
        },{
            $project:{
                schemeCode:"$_id",
                schemeName:1,
                totalUnits:1,
                totalInvestors:{$size:"$totalInvestors"}
            }
        },{
            $sort:{totalInvestors:-1}
        }]
        const response = await Portfolios.aggregate(pipeline);
        return res.json({success:true,message:'Popular funds fetched successfully',data:response})

    } catch (error) {
        return res.status(500).json({success:false,error:error.message})
    }
}
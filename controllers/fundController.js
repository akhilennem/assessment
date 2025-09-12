const Funds = require('../models/Fund')

exports.ListFunds = async(req,res)=>{
    try {
        
        const {search,page,limit}=req.query;
        if(!search || !page || !limit){
            return res.status(200).json({success:false,message:"search key,page and limit is required"})
        }
        const result = await Funds.find({schemeName:{ $regex:search,$options:"i" }}).skip(page)
      .limit(parseInt(limit));

      return res.status(200).json({success:true,message:'Fund fetched successfully',data:result})
    } catch (error) {
        return res.status(200).json({success:false,error:error.message})
    }
}

exports.NavHistory=async(req,res)=>{
    try {
        const schemeCode = req.query.schemeCode;
        if(!schemeCode){
            return res.status(200).json({success:false,message:'scheme code required'})
        }
        const pipeline = [{
            $match:{
                schemeCode:parseInt(schemeCode)
            }
        },{
            $lookup:{
                from:"fundnavhistories",
                localField:"schemeCode",
                foreignField:"schemeCode",
                as:"navHistory"
            }
        },{
            $project:{
                _id:0,
                schemeCode:1,
                schemeName:1,
                isinDivReinvestment:1,
                isinGrowth:1,
                NavHistory:"$navHistory"
            }
        }]

        const response = await Funds.aggregate(pipeline);
        if(response.length==0){
            
            return res.status(200).json({success:true,message:`No data found with scheme code:${schemeCode}`})

        }
        return res.status(200).json({success:true,message:'Nav History fetched successfully',data:response})

    } catch (error) {
        return res.status(200).json({successL:true,error:error.message})
    }
}
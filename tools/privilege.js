var user_sc = require("../Schema/user");

function isPrivileged(req, res, next) {
  userId=req.body.token;
  user_sc.findById(userId).exec(function (err, result) {
    console.log(result);
    if(err){
      err.status = 500;
      return next(err);
    
    }
    return next(result.type);
  })
    
  }
 
module.exports=isPrivileged;

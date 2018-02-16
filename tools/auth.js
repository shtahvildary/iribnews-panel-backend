var a={};
var bcrypt=require('bcrypt-nodejs');
var jwt=require('jsonwebtoken');
var consts=require('../config/consts');
var User=require('../Schema/user')
a.tokenize=function(user_id){
    var token = jwt.sign({ id: user_id }, consts.secret, { expiresIn: 604000 })
    return token;
}
a.checkToken=function(req,res,next){


    var token=req.header('x-access-token');
    jwt.verify(token, consts.secret, function (err, decoded) {
        if(err) return res.status(500).json({error:err,auth:false});
        User.findOne({_id:decoded.id},function(err,foundUser){
            if(err) return res.status(401).json({error:err,auth:false});
            if(!foundUser) return res.status(401).json({error:'Unknown token',auth:false});
            req.user=foundUser;
            next();
        });
    });
}
a.checkPermissions=(neededPermissions,userPermissions)=>{
    var granted=[];
    neededPermissions.map(n=>{
        userPermissions.map(u=>{
            if(u==n)granted.push(u);
        })
    })
    if(granted.length==neededPermissions.length)return true;
    return false;
}

module.exports=a;
var mongoose=require('mongoose');
var bcrypt=require("bcrypt");

var sc_user = mongoose.Schema({
    username:{type:'string' ,unique : true, required : true,trim: true},
    password:{type:'string',required:true},
    firstName:{type:'string'},
    lastName:{type:'string'},
    email:{type:'string',unique : true, required : true,trim: true},
    phoneNumber:{type:["number"]},
    personelNumber:{type:"number"},
    status:{type:'number',default:0},//0:active - 1:deactive - -1:deleted - 3:banned
    permitedChannelsId:{type:["string"]},
    type:{type:'number',default:1}//0:MainAdmin - 1:admin - 2:user
});
//user collection

//hashing a password before saving it to the database
sc_user.pre('save', function (next) {
    console.log("hashing is started...")
    var user = this._doc;
    // console.log(user.password);
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  });
module.exports=mongoose.model('User',sc_user);
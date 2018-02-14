var mongoose=require('mongoose');

var sc_permissions = mongoose.Schema({
  title:{type:String,required:true}, 
  description:String,  
});
module.exports=mongoose.model('permissions',sc_permissions);
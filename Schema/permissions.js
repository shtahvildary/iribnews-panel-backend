var mongoose=require('mongoose');

var sc_permissions = mongoose.Schema({
  title:String,   
});
module.exports=mongoose.model('permissions',sc_permissions);
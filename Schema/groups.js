var mongoose=require('mongoose');

var sc_groups = mongoose.Schema({
  title:String,
   permissions:{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'permissions'},
});
module.exports=mongoose.model('groups',sc_groups);


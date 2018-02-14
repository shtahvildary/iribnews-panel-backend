var mongoose=require('mongoose');

var sc_groups = mongoose.Schema({
  title:String,
  type:{type:'number',default:2},//0:zAdmin - 1:administrators - 2:users
   permissions:[{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'permissions'}],
    description:String,
});
module.exports=mongoose.model('groups',sc_groups);


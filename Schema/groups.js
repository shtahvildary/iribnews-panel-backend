var mongoose=require('mongoose');

var sc_groups = mongoose.Schema({
  title:String,
  type:{type:'number',default:2},//0:zAdmin - 1:Novin-administrators - 2:department-administrators -3:department-users
   permissions:[String],
    description:String,
    departmentId:{ type:mongoose.SchemaTypes.ObjectId, ref:"departments"},
    status:{type:'number',default:0},//0:active -  -1:deleted 
    readOnly:{type:'number',default:0}
    
});
module.exports=mongoose.model('groups',sc_groups);


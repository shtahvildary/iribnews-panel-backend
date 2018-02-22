var mongoose=require('mongoose');

var sc_departments = mongoose.Schema({
  title:{type:'string'},
  bot:{type:'string'},
  description:{type:'string'},
  status:{type:Number},
  port:{type:Number},

});
module.exports=mongoose.model('departments',sc_departments);


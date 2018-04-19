var mongoose=require('mongoose');

var sc_departments = mongoose.Schema({
  title:{type:'string'},
  bot:{type:'string'},
  description:{type:'string'},
  status:{type:Number,default:0}, //0:active  , -1:deleted  , 1:disable
  port:{type:Number},
  logo:{type:String},

});
module.exports=mongoose.model('departments',sc_departments);


var mongoose=require('mongoose');

var sc_departments = mongoose.Schema({
  title:{type:'string'},
  bot:{type:'string'},
  description:{type:'string'},
  status:{type:Number,default:0},
  port:{type:Number},
  logo:{type:String},

});
module.exports=mongoose.model('departments',sc_departments);


var mongoose=require('mongoose');

var sc_chats = mongoose.Schema({
  chatId:{type:'string'},
   trusted:{type:'number',required:true,default:0},//0:NotTrusted , 1:trusted
   
    
});
//user collection
module.exports=mongoose.model('chat',sc_user);


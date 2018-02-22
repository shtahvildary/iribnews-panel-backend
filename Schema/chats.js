var mongoose=require('mongoose');

var sc_chats = mongoose.Schema({
  chatId:{type:'string'},
   trusted:{type:'number',required:true,default:1},//0:NotTrusted , 1:trusted
   chatTiltle:String,
    chatType:String,
    departmentId:[{ type:mongoose.SchemaTypes.ObjectId, ref:"departments"}],
    
});
module.exports=mongoose.model('chat',sc_chats);


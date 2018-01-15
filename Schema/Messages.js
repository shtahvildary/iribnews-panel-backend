const mongoose=require("mongoose");

var messageSchema=mongoose.Schema({
    chatId:String,
    chatTiltle:String,
    voteItemId:String, //channel or program ID
    type:String,    
    chatType:String,
    message:String,
    date:{type:Date,default:Date.now},
    keywords:[{word:String,count:Number}],
    replys:[{text:String,userId:{type: mongoose.SchemaTypes.ObjectId, ref:'User'},date:{type:Date,default:Date.now}}],
    //video,Audio,voice,photo,document,sticker,videoNote
    fileId:String,
    mime:String,
    //video,photo
    caption:String,
    //Audio
    audioTitle:String,
    
    //photo
    //image:TYPE?????

    //document
    fileName:String,

    //emoji
    emoji:String

    


})


module.exports=mongoose.model("messages",messageSchema);
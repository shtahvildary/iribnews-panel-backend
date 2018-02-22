const mongoose = require("mongoose");

var messageSchema = mongoose.Schema({
    chatId: String,
    chatTiltle: String,
    voteItemId: String, //channel or program ID
    type: String,
    chatType: String,
    message_id:String, 
    replyTo:String,          
    message: String,
    date: {
        type: Date,
        default: Date.now
    },
    departmentId:{ type:mongoose.SchemaTypes.ObjectId, ref:"departments"},
    
    keywords: [{
        word: String,
        count: Number
    }],
    pin: [Number],
    isSeen: [{
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User'
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    replys: [{
        text: String,
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User'
        },
        date: {
            type: Date,
            default: Date.now
        },
        message_id:String,
    }],
    //video,Audio,voice,photo,document,sticker,video_note
    fileId: String,
    mime: String,
    filePath: String,
    
    //video,photo
    caption: String,
    //Audio
    audioTitle: String,

    //photo
    //image:TYPE?????

    //document
    fileName: String,

    //emoji
    emoji: String
})


module.exports = mongoose.model("messages", messageSchema);
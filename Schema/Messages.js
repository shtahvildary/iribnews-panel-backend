const mongoose = require("mongoose");

var messageSchema = mongoose.Schema({
    chatId: String,
    chatTiltle: String,
    voteItemId: String, //channel or program ID
    type: String,
    chatType: String,
    message_id: String,
    replyTo: String,
    message: String,
    date: {
        type: Date,
        default: Date.now
    },
    departmentId: { type: mongoose.SchemaTypes.ObjectId, ref: "departments" },

    keywords: [{
        word: String,
        count: Number
    }],
    pin: {
        // pin: [{
        status: {
            type: Number, //0:unPin     1:pin
             default: 0,
        },
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User'
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
// }],
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
        filePath:String,
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User'
        },
        date: {
            type: Date,
            default: Date.now
        },
        message_id: String,
    }],
    //video,Audio,voice,photo,document,sticker,video_note
    fileId: String,
    mime: String,
    filePath: String,

    //video,photo
    caption: {type:String,default:""},
    //Audio
    audioTitle: {type:String,default:""},

    //photo
    //image:TYPE?????

    //document
    fileName: String,

    //emoji
    emoji: String
})


module.exports = mongoose.model("messages", messageSchema);
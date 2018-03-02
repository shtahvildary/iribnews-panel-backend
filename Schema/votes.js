const mongoose = require("mongoose");
// var voteItemSchema=require("./voteItems");
// var voteItems = mongoose.model('voteItem', voteItemSchema);

var voteSchema = mongoose.Schema({
    chatId: String,
    
    chatTiltle: String,
    //type: Number, //0:channel voting , 1:program voting
    date: {
        type: Date,
        default: Date.now
    },
    vote: {
        destinationId:{ type:mongoose.SchemaTypes.ObjectId, ref:"voteItems"}, //channelId or programId
        score: { //0<=score<=5
            type: Number,
            default: 0
        }
    },
    comment:{
        destinationId:{ type:mongoose.SchemaTypes.ObjectId, ref:"voteItems"}, //channelId or programId
        text: {
            type: String,
            default: ""
        }
    },
})
module.exports = mongoose.model("votes", voteSchema);
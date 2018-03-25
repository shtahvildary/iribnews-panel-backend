const mongoose=require("mongoose");

var competitionResults=mongoose.Schema({
    chatId:String,    
    // botId:Number  
    competitionId:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'competitions'
    },
    
    answer:{text:String,correct:Boolean},
    date: {
        type: Date,
        default: Date.now
    },
    winner:Boolean,
});
module.exports=mongoose.model("competitionResults",competitionResults);

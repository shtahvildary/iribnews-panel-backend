const mongoose=require("mongoose");

var surveyResults=mongoose.Schema({
    chatId:String,    
    // botId:Number  
    surveyId:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'surveys'
    },
    
    text:String,
    date: {
        type: Date,
        default: Date.now
    },
    
});
module.exports=mongoose.model("surveyResults",surveyResults);

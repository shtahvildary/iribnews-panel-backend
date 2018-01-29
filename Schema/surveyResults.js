const mongoose=require("mongoose");

var surveysSchema=mongoose.Schema({
    chatId:String,    
    // botId:Number  
    surveyId:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'surveys'
    },
    
    text:String,
    
});
module.exports=mongoose.model("surveys",surveysSchema);

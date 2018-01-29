const mongoose=require("mongoose");

var surveysSchema=mongoose.Schema({
    chatIds=[String],
    title:String,    
    // botId:Number  
    voteItemId:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'voteItems'
    },
    userId:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    text:String,
    keyboard:[String],
});
module.exports=mongoose.model("surveys",surveysSchema);

const mongoose=require("mongoose");

var surveysSchema=mongoose.Schema({
    chatIds:[String],
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
    date: {
        type: Date,
        default: Date.now
    },
    text:String,
    keyboard:[String],
    isSent:{type:Number,default:0}//0: this survey is sent to chatIds   1:it is not sent yet
});
module.exports=mongoose.model("surveys",surveysSchema);

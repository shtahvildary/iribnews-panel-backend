const mongoose=require("mongoose");

var competitionsSchema=mongoose.Schema({
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
    question:String,
    keyboard:[{text:String,correctAnswer:Boolean}],
    isSent:{type:Number,default:0},//0: this survey is sent to chatIds   1:it is not sent yet
    departmentId:{ type:mongoose.SchemaTypes.ObjectId, ref:"departments"},
});
module.exports=mongoose.model("competitions",competitionsSchema);

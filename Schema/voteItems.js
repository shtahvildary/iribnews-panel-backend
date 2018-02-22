const mongoose=require("mongoose");

var voteItemSchema=mongoose.Schema({
    title:String,    
    type:Number,//0:channel , 1:program  
    description:String,
    enable:{type:Number,default:1},//0:disable , 1:enable
    
    //channels

    //programs
    channelId:String,    
    personnels:[{type:String}],
    departmentId:{ type:mongoose.SchemaTypes.ObjectId, ref:"departments"},
});
module.exports=mongoose.model("voteItems",voteItemSchema);

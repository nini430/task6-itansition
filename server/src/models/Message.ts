import mongoose from "mongoose";

const MessageSchema=new mongoose.Schema({
    message:{
        type:String,
        required:true
    },
    from:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    to:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    conversationId:{
        type:mongoose.Types.ObjectId,
        ref:'Conversation'
    }
},{timestamps:true})

export default mongoose.model('Message',MessageSchema);
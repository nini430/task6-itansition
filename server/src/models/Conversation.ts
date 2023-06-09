import mongoose from "mongoose";


const ConversationSchema=new mongoose.Schema({
    subject:{
        type:String,
        required:true
    },
    from:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    to:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true});

export default mongoose.model('Conversation',ConversationSchema);
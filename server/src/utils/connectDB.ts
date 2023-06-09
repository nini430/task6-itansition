import mongoose from 'mongoose'

const connectDB=async()=>{
    const conn=await mongoose.connect(process.env.MONGO_URI!);
    console.log(`MongoDb connected at ${conn.connection.host}`)
}

mongoose.connection.on('error',(err)=>{
    console.log(err.message);
})

export default connectDB;
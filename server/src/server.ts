import http from 'http';
import dotenv from 'dotenv'
import io from 'socket.io'
dotenv.config();

import app from './app';
import connectDB from './utils/connectDB';
import ioListen from './sockets';

const PORT=8900;

const server=http.createServer(app);
const ioServer=new io.Server();
ioServer.attach(server,{cors:{origin:'*',methods:['GET','POST']}})

server.listen(PORT,()=>{
    connectDB();
    ioListen(ioServer);
    console.log(`Server running on port ${PORT}`);
})
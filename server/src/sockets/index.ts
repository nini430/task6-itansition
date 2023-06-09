import { Server } from 'socket.io';

const ioListen = (io: InstanceType<typeof Server>) => {
  const activeUsers = new Map();
  io.on('connection', (socket) => {
    console.log(`User connected with id : ${socket.id} `);
    const { userId } = socket.handshake.query;
    if (activeUsers.has(userId)) {
      const connectedSocket = activeUsers.get(userId);
      connectedSocket.disconnect();
      activeUsers.set(userId, socket);
    } else {
      activeUsers.set(userId, socket);
    }

    socket.on('send-message', ({ message }:any) => {
        socket
        .to(activeUsers.get(message.message.to).id)
          .emit('receive-message', { message });
      })
    }
  );
}


export default ioListen;

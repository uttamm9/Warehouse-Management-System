// src/socket.js
const { Server } = require("socket.io");
let io;

module.exports = {
    init: (httpServer) => {
        io = new Server(httpServer, {
            cors: { origin: "*" }
        });

        io.on('connection', (socket) => {
            console.log('Client connected for real-time monitoring:', socket.id);
        });
        return io;
    },
    getIo: () => {
        if (!io) throw new Error("Socket.io not initialized!");
        return io;
    }
};

import { Server } from 'socket.io';

export let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log(`🔌 New client connected: ${socket.id}`);

        // Join specific user room
        socket.on('joinUserRoom', (userId) => {
            const roomName = `user_${userId}`;
            socket.join(roomName);
            console.log(`👤 User ${userId} joined room: ${roomName}`);
        });

        // Join admin room
        socket.on('joinAdminRoom', () => {
            socket.join('admin_room');
            console.log(`🛡️  Admin joined admin_room from socket: ${socket.id}`);
        });

        // Join agent room
        socket.on('joinAgentRoom', () => {
            socket.join('agent_room');
            console.log(`🚚 Agent joined agent_room from socket: ${socket.id}`);
        });

        socket.on('disconnect', () => {
            console.log(`🔌 Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

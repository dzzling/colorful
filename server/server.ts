// Import required modules
import express from 'express';
import http from 'http'
import { Server } from 'socket.io';
import cors from 'cors';
import { getRandomColors } from '../src/lib/colors.js';
import { getRandomInt } from '../src/lib/random.js';
import { generateUsername } from '../src/lib/generateNames.js';
import { generateRoom } from '../src/lib/generateRoomNames.js';

// Create an Express app
const app = express();

app.use(cors())

// Create a HTTP server using the Express app
const server = http.createServer(app);

// Create a Socket.IO instance and attach it to the HTTP server
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Define a map to store user IDs
const userMap = new Map();

// Count up room numbers
let adjIdx = 0;
let nounIdx = 0;


// Define a handler for socket connections
io.on('connection', (socket) => {

    const userId = generateUsername();

    // Log user ID and store it in the map
    console.log(`User ${userId} connected`);
    userMap.set(socket.id, userId);


    socket.on('join room', (room) => {
        const userId = userMap.get(socket.id);
        socket.join(`${room}`);

        const rooms = io.of("/").adapter.rooms;
        const socketsInRoom: Set<string> | undefined = rooms.get(room);

        const roomUsers: Array<Number> = []
        socketsInRoom!.forEach((_, socketId) => {
            const userId: number = userMap.get(socketId);
            roomUsers.push(userId);
        });

        socket.to(room).emit('new user', roomUsers);
        io.to(socket.id).emit('new user', roomUsers);
        io.to(socket.id).emit('join room', room);

        console.log(`User ${userId} has joined room: ${room}`);
    });

    socket.on('create room', room => {

        if (adjIdx === 49) {
            adjIdx = 0;
            nounIdx += 1;
        }
        if (nounIdx === 49) {
            adjIdx = 0;
            nounIdx = 0;
        }
        room = generateRoom(adjIdx, nounIdx);
        adjIdx += 1;


        socket.join(room);
        const userId = userMap.get(socket.id);

        io.to(socket.id).emit('new user', [userId]);
        io.to(socket.id).emit('create room', room);

        console.log(`User ${userId} has created room ${room}`);
    });

    socket.on('initialize', room => {
        const colors = getRandomColors(0);
        const initPackage = JSON.stringify([getRandomInt(0, colors.length - 1), colors.map((c) => c.hex()), 0]);
        io.in(room).emit('initialize', initPackage);

        const rooms = io.of("/").adapter.rooms;
        const socketsInRoom: Set<string> | undefined = rooms.get(room);

        // Log information about each socket in the room
        socketsInRoom!.forEach((_, socketId) => {
            const socket = io.sockets.sockets.get(socketId);
            const userId = userMap.get(socketId);
            io.to(socketId).emit('username', userId)
        });

    })

    socket.on('next screen', (room) => {
        socket.to(room).emit('next screen');
    });

    socket.on('confirm color', (logPackage) => {
        const selectedColor = logPackage[0];
        const room = logPackage[1];
        socket.to(room).emit('confirm color', selectedColor);
    });

    socket.on('resetGame', (receivedData) => {
        const newDifficulty = receivedData[0];
        const room = receivedData[1];
        const type = receivedData[2];
        const colors = getRandomColors(newDifficulty);
        const resetPackage = JSON.stringify([getRandomInt(0, colors.length - 1), colors.map((c) => c.hex()), newDifficulty, type]);
        io.in(room).emit('reset game', resetPackage);
    })

    socket.on('send clue', (clue) => {
        let rooms = io.of("/").adapter.sids.get(socket.id)!;
        let room = [...rooms].pop()!
        io.in(room).emit('receive clue', clue);
    });

    socket.on('disconnect', (room) => {
        // Get the user ID from the map
        const userId = userMap.get(socket.id);
        if (userId) {
            console.log(`User ${userId} disconnected`);
            // Remove user ID from the map
            userMap.delete(socket.id);
        } else {
            console.log('Unknown user disconnected');
        }
    });
});

// Start the server
server.listen(8080, () => {
    console.log('Server listening on port 8080');
});
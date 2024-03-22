// Import required modules
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { getRandomColors } from '../src/lib/colors.js';
import { getRandomInt } from '../src/lib/random.js';

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

// Define a map to store room users
const roomUsers = new Map();

// Count up room numbers
let roomID = 1;

function Room(colors, target, difficulty) {
    this.colors = colors;
    this.target = target;
    this.difficulty = difficulty;
}

// Define a handler for socket connections
io.on('connection', (socket) => {

    const userId = uuidv4();

    // Log user ID and store it in the map
    console.log(`User ${userId} connected`);
    userMap.set(socket.id, userId);


    socket.on('join room', (room) => {
        const userId = userMap.get(socket.id);
        socket.join(`${room}`);
        io.to(socket.id).emit('join room', room);


        roomUsers.get(`${room}`).push(userId);
        let newUserlist = roomUsers.get(`${room}`);
        roomUsers.set(`${room}`, newUserlist);

        socket.to(room).emit('new user', newUserlist);
        io.to(socket.id).emit('new user', newUserlist);

        console.log(`User ${userId} has joined room: ${room}`);
    });

    socket.on('create room', room => {
        room = 'room' + roomID.toString();
        // const colors = getRandomColors(0);
        // const roomState = Room(colors.map((c) => c.hex()), getRandomInt(0, colors.length - 1), 1)
        // roomStates.set(roomID, roomState)
        roomID += 1;
        socket.join(`${room}`);
        const userId = userMap.get(socket.id);
        roomUsers.set(`${room}`, [userId]);

        io.to(socket.id).emit('new user', [userId]);
        io.to(socket.id).emit('create room', room);

        console.log(`User ${userId} has created room ${room}`);
    });

    socket.on('initialize', room => {
        // const roomState = roomStates.get(room);
        const colors = getRandomColors(0);
        const initPackage = JSON.stringify([getRandomInt(0, colors.length - 1), colors.map((c) => c.hex()), 1]);
        socket.to(`${room}`).emit('initialize', initPackage);
    })

    socket.on('next screen', (proposed_screen) => {
        screen = proposed_screen;
        socket.broadcast.emit('next screen', proposed_screen);
    });

    socket.on('log color', (selectedColor) => {
        socket.broadcast.emit('log color', selectedColor);
    });

    socket.on('disconnect', () => {
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
server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
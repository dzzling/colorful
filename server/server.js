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
const colors = getRandomColors(1);
const targetColorIndex = getRandomInt(0, colors.length - 1);
let screen = 0;

// Define a handler for socket connections
io.on('connection', (socket) => {

    const userId = uuidv4();

    // Log user ID and store it in the map
    console.log(`User ${userId} connected`);
    userMap.set(socket.id, userId);

    const initPackage = JSON.stringify([targetColorIndex, colors.map((c) => c.hex()), screen]);
    socket.emit('initialize', initPackage);

    socket.on('next screen', (proposed_screen) => {
        screen = proposed_screen;
        socket.broadcast.emit('next screen', proposed_screen);
    });

    socket.on('log color', (selectedColor) => {
        socket.broadcast.emit('log color', selectedColor);
    });

    socket.on('check room', (submittedRoom) => {
        const userId = userMap.get(socket.id);
        // TODO
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
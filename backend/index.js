const express = require('express');
const app = express();
const dotenv = require('dotenv')
const { chats } = require("./data/data")
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const path = require('path')

const cors = require('cors')

dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB(); // function that used to connect to mongoDB

app.use(express.json()); //to accept data as json

app.use(cors())
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// const pathToBuild = require('../frontend/build')

// Code for Deployment
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "https://talk-tome.netlify.app/")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname1, "https://talk-tome.netlify.app/", "index.html"));
        console.log(path.join(__dirname1, "https://talk-tome.netlify.app/", "index.html"));
    })
} else {
    app.get('/', (req, res) => {
        res.send('hello there I am listening')
    })
}

// -------------------------------------

app.use(notFound);
app.use(errorHandler);


// listening on the port:5000 || localhost:5000/
// app.listen(PORT, console.log(`I'm listening at ${PORT}`));
const server = app.listen(PORT);

// connection from server to the frontend
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: '*'
    }
})

io.on('connection', (socket) => {
    // console.log('connect to soket.io');

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        // console.log(userData._id)
        socket.emit('connected');
    })

    socket.on('join chat', room => {
        socket.join(room)
        console.log(`Our user joined the room: ${room}`);
    })

    socket.on('typing', room => socket.in(room).emit('typing'))
    socket.on('stop typing', room => socket.in(room).emit('stop typing'))

    socket.on('new message', newMessageReceived => {
        var chat = newMessageReceived.chat;

        if (!chat.users) return console.log('chat.users not defined');

        chat.users.forEach(user => {
            if (user._id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit('message received', newMessageReceived)
        });
    })

    socket.off('setup', () => {
        socket.emit('user disconnected');
        socket.leave(userData._id)
    })
})

module.exports = app;
const express = require('express')
const socket = require('socket.io')
const cors = require('cors')
const db = require('./models')

// App setup
const app = express()
app.use(cors({ origin: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routers 
require('./routes/user.routes')(app)
require('./routes/room.routes')(app)
require('./routes/message.routes')(app)

// Error Handler
app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message || 'Oops something went wrong!' })
})

// Databse setup
db.mongoose.connect(db.url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('connected to databse')
    })
    .catch(err => {
        console.log('cannot connect to database')
        process.exit();
    })

// server
const server = app.listen(process.env.PORT || 3000, () => console.log('server running on port 3000'))

// socket.io setup
const io = socket(server)

// chat namespace
const chatNsp = io.of('/chats');

// //todo
// chatNsp.use((socket, next) => {
//     // ensure the user has sufficient rights
//     next();
// });

chatNsp.on('connection', socket => {
    console.log('made connection in chats socket => ', socket.id)

    // Join a room 
    socket.on('subscribe', function ({ room, user }) {
        console.log('joining room', room);
        socket.join(room);
        chatNsp.to(room).emit('USER_JOINED', user)
    })

    // Leave a room
    socket.on('unsubscribe', function ({ room, user }) {
        console.log('leaving room', room);
        chatNsp.to(room).emit('USER_LEFT', user)
        socket.leave(room);
    })

    // User typing
    socket.on('user typing', function ({ room, user, status }) {
        if (status) {
            console.log(`${user} is typing in room ${room}.`)
        }
        else {
            console.log(`${user} stopped typing in room ${room}.`)
        }
        chatNsp.to(room).emit('USER_TYPING', { user, status })
    })

    // send message
    socket.on('new message', function (data) {
        chatNsp.to(data.room).emit('NEW_MESSAGE', data)
    })

    // new room created
    socket.on('new room', function (room) {
        // emit to all sockets in namespace
        chatNsp.emit('NEW_ROOM', room)
    })
});
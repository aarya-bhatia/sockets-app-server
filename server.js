const express = require('express')
const socket = require('socket.io')
const cors = require('cors')
const db = require('./models')
const roomModel = require('./models/room.model')

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
    res.status(500).send({ message: 'Oops something went wrong!' })
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

io.once('connection', socket => {
    console.log('connected to socket root => ' + socket.id)
    io.on('online', payload => {
        io.sockets.emit('online', payload)
    })

    io.on('offline', payload => {
        io.sockets.emit('offline', payload)
    })
})

// chat namespace
const chatNsp = io.of('/chats');

//todo
chatNsp.use((socket, next) => {
    // ensure the user has sufficient rights
    next();
});

chatNsp.on('connection', socket => {
    console.log('made connection in chats namespace => ', socket.id)

    // Join a room 
    socket.on('subscribe', function (room, user) {
        console.log('joining room', room);
        socket.join(room);
        chatNsp.to(room).emit('user joined', { room, user })
    })

    // Leave a room
    socket.on('unsubscribe', function (room, user) {
        console.log('leaving room', room);
        socket.leave(room);
        chatNsp.to(room).emit('user leaving', { room, user })
    })

    // User typing
    socket.on('user typing', function (room, user, status) {
        if (status) {
            console.log(`${user} is typing in room ${room}.`)
        }
        else {
            console.log(`${user} stopped typing in room ${room}.`)
        }
        chatNsp.to(room).emit('user typing', { room, user, status })
    })

    // send message
    socket.on('new message', function(room, user, content, time) {
        chatNsp.to(room).emit('new message', { room, user, content, time })
    })
});

// old code
/*
io.on('connection', socket => {
    console.log('made connection to socket => ', socket.id)

    socket.on('user joined', payload => {
        io.sockets.emit('user joined', payload)
    })

    socket.on('user typing', payload => {
        //console.log('user is typing')
        io.sockets.emit('user typing', payload)
    })


    socket.on('user leaving', payload => {
        io.sockets.emit('user leaving', payload)
    })

    socket.on('user has typed', payload => {
        //console.log('user has typed')
        io.sockets.emit('user has typed', payload)
    })

    socket.on('new message', payload => {
        io.sockets.emit('new message', payload)
    })

    io.on('disconnect', () => {
        console.log('disconnected from socket')
    })
})
*/
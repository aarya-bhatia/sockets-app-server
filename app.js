const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const socket = require('socket.io');
const port = process.env.PORT || 3000;

const app = express();

const server = app.listen(port, function () {
    console.log('listening on port ' + port)
})

/** databse setup */

mongoose.connection.on('connected', function () {
    console.log('Successfully connected to database');
});
mongoose.connection.on('disconnected', function () {
    console.log('Disconnected from database');
});
mongoose.connection.on('error', function () {
    console.log('Error while connecting to database');
    process.exit();
});

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log("Mongoose default connection is disconnected due to application termination");
        process.exit(0)
    });
});

mongoose.connect(require("./config").DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

/** socket.io setup */
const io = socket(server)

io.on('connection', function (socket) {
    console.log('socket connection: ' + socket.id)

    io.on('REGISTER', function (username) {
        register_client(username, socket.id)
    })

    io.on('disconnect', function () {
        unregister_client(socket.id)
    })
})

/** middleware and routers */
app.use(cors({ origin: true }))

app.use(express.json())

app.use(require('./routers'))

app.use(function (err, req, res, next) {
    res.status(500).send(err || 'oops something went wrong!')
})

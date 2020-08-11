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

const connections = []
const users = {}

require('./socketHandler')(io, connections)
require('./socketHandler/chat')(io, users)
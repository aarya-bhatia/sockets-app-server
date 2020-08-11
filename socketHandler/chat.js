module.exports = (io, users) => {
    const chatNsp = io.of('/chats');

    chatNsp.on('connection', socket => {
        console.log('made connection in chats socket => ', socket.id)

        function showRooms() {
            chatNsp.emit('ROOM_STATUS', Object.keys(users))
        }

        function makeRoomConnection(room, user) {
            if (!users[room]) {
                users[room] = {} // register room
            }

            if (!users[room][user]) {
                users[room][user] = 1
            } else {
                users[room][user]++
            }
        }

        function stopRoomConnection(room, user) {
            if (!users[room]) {
                return
            }

            if (users[room][user]) {
                users[room][user]--
            }
            // no more connections in this room from user
            if (users[room][user] === 0) {
                delete users[room][user]
            }
            // no more users in room
            if (Object.keys(users[room]).length === 0) {
                delete users[room]
            }
        }

        function showUsers(room) {
            if (users[room]) {
                chatNsp.emit('USER_STATUS', Object.keys(users[room]))
            }
        }

        // Join a room 
        socket.on('subscribe', function ({ room, user }) {
            console.log('joining room', room);
            socket.join(room);
            chatNsp.to(room).emit('USER_JOINED', user)

            makeRoomConnection(room, user)
            showUsers(room)
            showRooms()
        })

        // Leave a room
        socket.on('unsubscribe', function ({ room, user }) {
            console.log('leaving room', room);
            chatNsp.to(room).emit('USER_LEFT', user)
            socket.leave(room);

            stopRoomConnection(room, user)
            showUsers(room)
            showRooms()
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
}
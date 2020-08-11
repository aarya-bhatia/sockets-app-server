module.exports = (io, connections) => {

    // middleware
    // io.use((socket, next) => {
    //     let token = socket.handshake.query.token;
    //     if (isValid(token)) {
    //         return next();
    //     }
    //     return next(new Error('authentication error'));
    // });

    io.on('connection', socket => {
        addConnection()
        totalConnections()

        function totalConnections() {
            console.log('total connections -> ', connections.length)
        }

        function addConnection() {
            connections.push(socket.id)
        }

        function removeConnection() {
            connections = connections.filter(connection => {
                return connection != socket.id
            })
        }

        socket.on('get connections', function () {
            totalConnections()
        })

        socket.on('disconnect', function () {
            removeConnection()
        })
    })
}
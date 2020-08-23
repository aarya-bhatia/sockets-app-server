"use strict";

module.exports = class SocketController {

    contructor() {
        this.clients = new Map();
        this.connections = new Map();
        this.channels = new Map();
    }

    register_client(username, socketId) {

        // socketid -> username reference map 
        this.connections.set(socketId, username);

        // if the client does not exist
        if (!this.clients.has(username)) {
            this.clients.set(username, [socketId])
        } else {
            // otherwise, register a new connection for existing client.
            const prev = this.clients.get(username)
            this.clients.set(username, [...prev, socketId])
        }
    }

    unregister_client(socketId) {
        // using reference map to locate the required client 
        const username = this.connections.get(socketId)
        this.connections.delete(socketId)

        // removing the socketid from clients map
        const prev = this.clients.get(username)
        const next = prev.filter(id => id !== socketId)
        this.clients.set(username, next)

    }

    add_client_to_channel(socketId, channelId) {
        if (channels.has(channelId)) {
            const previous = channels.get(channelId)
            channels.set(channelId, [...previous, socketId])
        } else {
            channels.set(channelId, [socketId])
        }
    }

    remove_client_from_channel(socketId, channelId) {
        if (channels.has(channelId)) {
            const previous = channels.get(channelId)
            const next = previous.filter(id => id !== socketId)
            channels.set(channelId, next)
        }
    }

    send_message_to_channel(message, channelId) {
        if (channels.has(channelId)) {
            const sockets = channels.get(channelId)
            sockets.forEach(socket => {
                io.to(socket).emit('message', message)
            })
        }
    }

    send_message_to_client(message, username) {
        // send message to all connections of the client
        if (clients.has(username)) {
            const sockets = clients.get(username)
            socket.forEach(socket => io.to(socket).emit('message', message))
        }
    }
}
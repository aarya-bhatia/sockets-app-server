module.exports = function (socketIO) {
  return {
    socketIO,
    active: {},
    reference: {},
    sendMessage: function (message, user_id) {
      if (this.active.hasOwnProperty(user_id)) {
        this.socketIO.to(this.active[user_id]).emit("new_message", message);
      }
    },
    register: function (user, socket_id) {
      this.active[user._id] = socket_id;
      this.reference[socket_id] = user._id;
      this.log();
    },
    unregister: function (socket_id) {
      const user_id = this.reference[socket_id];
      if (!user_id) return;
      delete this.active[user_id];
      delete this.reference[socket_id];
      this.log();
    },
    log: function () {
      console.log(`${Object.keys(this.active).length} sockets are connected`);
    },
  };
};

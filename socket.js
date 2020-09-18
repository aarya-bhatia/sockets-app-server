module.exports = function (socketIO, active) {
  socketIO.on("connection", function (socket) {
    console.log("socket connection: " + socket.id);
    const socket_id = socket.id;

    socketIO.on("REGISTER", function (user) {
      active[user.user_id] = socket_id;
      console.log(active);
    });

    socketIO.on("disconnect", function () {
      console.log(active);
    });
  });
};

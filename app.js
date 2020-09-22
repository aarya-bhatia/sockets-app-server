const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 4000;
const mongoose = require("mongoose");
const db = require("./mongodb")(mongoose);

db.run();

mongoose.set("useFindAndModify", false);

const app = express();

const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.use(cors({ origin: true }));
app.use(express.json());

const socketIO = require("socket.io")(server);
const socketController = require("./controllers/socket")(socketIO);

socketIO.on("connection", function (socket) {
  const socket_id = socket.id;
  console.log("socket connection: " + socket_id);

  socketIO.on("register", function (user) {
    socketController.register(user, socket_id);
  });

  socketIO.on("disconnect", function () {
    socketController.unregister(socket_id);
  });
});

require("./routers")(app, db, socketController);

app.use("*", (req, res) => {
  res.sendStatus(404);
});

app.use(function (err, req, res, next) {
  res.status(500).json(err.message);
});

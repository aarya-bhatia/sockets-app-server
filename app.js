const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3000;
const moment = require("moment");
const mongoose = require("mongoose");
const db = require("./mongodb")(mongoose);

db.run();

const app = express();

const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

const socketIO = require("socket.io")(server);
require("./socket")(socketIO);

app.use(cors({ origin: true }));
app.use(express.json());

require("./routers")(app, db);

app.use("*", (req, res) => {
  res.sendStatus(404);
});

app.use(function (err, req, res, next) {
  res.status(500).json(err.message);
});

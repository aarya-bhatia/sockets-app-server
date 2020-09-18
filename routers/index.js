const router = require("express").Router();

module.exports = (app, db) => {
  require("./users")(router, db);
  require("./chats")(router, db);
  require("./contacts")(router, db);
  require("./messages")(router, db);
  app.use(router);
};

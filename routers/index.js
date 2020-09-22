const router = require("express").Router();

module.exports = (app, db, socketController) => {
  require("./users")(router, db);
  require("./chats")(router, db);
  require("./contacts")(router, db);
  require("./messages")(router, db, socketController);
  app.use(router);
};

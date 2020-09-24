module.exports = (router, db) => {
  router.get("/chats/:user_id", async (req, res, next) => {
    try {
      const chats = await db.Chat.find(
        { "users._id": req.params.user_id },
        { messages: { $slice: -30 } } // return last n messages of each chat
      );
      res.json({ chats });
    } catch (err) {
      next(err);
    }
  });

  router.post("/chats", async (req, res, next) => {
    try {
      const { user_id, user_name, contact_id, contact_name } = req.body;
      const chat = await db.Chat.create({
        users: [
          { _id: user_id, name: user_name },
          { _id: contact_id, name: contact_name },
        ],
        messages: [],
      });
      res.json(chat);
    } catch (err) {
      next(err);
    }
  });

  router.post("/chats/:chat_id/seen-by/:user_id", async (req, res, next) => {
    try {
      const { chat_id, user_id } = req.params;
      await db.Chat.updateOne(
        { _id: chat_id, seenAt: { $elemMatch: { user_id } } },
        {
          $set: {
            "seenAt.$.time": new Date(),
          },
        }
      );
      res.status(200).send();
    } catch (err) {
      next(err);
    }
  });
};

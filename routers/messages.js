module.exports = (router, db) => {
  router.get("/messages/:chat_id", async (req, res, next) => {
    const { limit, offset } = req.query;
    const chat_id = req.params;
    try {
      // To load more messages
      const messages = await db.Chat.findById(chat_id, {
        messages: { $slice: [offset || 0, -limit] },
      });
      res.json(messages);
    } catch (err) {
      next(err);
    }
  });

  router.post("/messages/:chat_id", async (req, res, next) => {
    const date = moment().format("YYYY/MM/DD");
    const time = moment().format("ddd, h:mm A");
    const message = {
      chat_id: req.params.chat_id,
      content: req.body.content,
      author_id: req.body.author_id,
      author_name: req.body.author_name,
      date,
      time,
      seenBy: [],
      likedBy: [],
    };
    try {
      // await Message.create(message);
      await db.Chat.findByIdAndUpdate(req.params.chat_id, {
        $push: { messages: message },
      });
      res.json(message);
    } catch (err) {
      next(err);
    }
  });
};

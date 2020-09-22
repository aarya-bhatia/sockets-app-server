module.exports = (router, db, socketController) => {
  router.get("/messages/:chat_id", async (req, res, next) => {
    const { limit = 0, offset = 20 } = req.query;
    const { chat_id } = req.params;
    try {
      // To load more messages
      const result = await db.Chat.findById(chat_id, {
        messages: { $slice: [parseInt(offset), parseInt(limit)] },
      });
      res.json(result.messages);
    } catch (err) {
      next(err);
    }
  });

  router.post("/messages", async (req, res, next) => {
    const { chat_id, content, author_id, author_name, recipient_id } = req.body;

    const date = new Date();
    const time = date.toLocaleTimeString().substring(0, 5); // hh:mm

    // create message obj
    const message = {
      _id: db.generateId(),
      chat_id,
      content,
      author_id,
      author_name,
      date,
      time,
      seenBy: [],
      likedBy: [],
    };

    // send the message with socket.io
    if (recipient_id) {
      socketController.sendMessage(message, recipient_id);
    } else {
      console.log("no recipient id found");
    }

    // save the message in mongodb
    try {
      await db.Chat.findByIdAndUpdate(chat_id, {
        $push: { messages: message },
      });
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  });
};

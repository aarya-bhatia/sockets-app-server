module.exports = (router, db) => {
  router.get("/contacts/:user_id", async (req, res, next) => {
    try {
      const user = await db.User.findById(req.params.user_id);
      const contacts = await db.User.find({
        _id: {
          $in: user.contacts,
        },
      });
      res.status(200).json(contacts);
    } catch (err) {
      next(err);
    }
  });

  router.post("/contacts/:user_id/add/:contact_id", async (req, res, next) => {
    try {
      const { user_id, contact_id } = req.params;
      const user = await db.User.findById(user_id);
      const contact = await db.User.findById(contact_id);

      if (contact.privacy === "Private") {
        return res.status(400).json({
          message:
            "You cannot add this contact because they have a private account.",
        });
      }

      user.incoming_requests = user.incoming_requests.filter(
        (id) => id !== contact_id
      );
      user.outgoing_requests = user.outgoing_requests.filter(
        (id) => id !== contact_id
      );
      contact.incoming_requests = contact.incoming_requests.filter(
        (id) => id !== contact_id
      );
      contact.outgoing_requests = contact.outgoing_requests.filter(
        (id) => id !== contact_id
      );

      if (!user.contacts.includes(contact_id)) {
        user.contacts.push(contact_id);
      }

      if (!contact.contacts.includes(user_id)) {
        contact.contacts.push(user_id);
      }

      await user.save();
      await contact.save();

      await db.Chat.create({
        users: [
          { _id: user_id, name: user.name },
          { _id: contact_id, name: contact.name },
        ],
        messages: [],
        seenAt: [
          { user_id: user_id, time: new Date() },
          { user_id: contact_id, time: new Date() },
        ],
      });

      res.status(200).send();
    } catch (err) {
      next(err);
    }
  });

  router.post("/contacts/:user_id/send/:contact_id", async (req, res, next) => {
    const { user_id, contact_id } = req.params;
    try {
      const user = await db.User.findById(user_id);
      const contact = await db.User.findById(contact_id);

      if (!user || !contact) {
        return res.sendStatus(400);
      }

      if (
        user.outgoing_requests.includes(contact_id) ||
        user.incoming_requests.includes(contact_id) ||
        contact.outgoing_requests.includes(user_id) ||
        contact.incoming_requests.includes(user_id)
      ) {
        return res.sendStatus(400);
      }

      user.outgoing_requests.push(contact_id);
      contact.incoming_requests.push(user_id);

      await user.save();
      await contact.save();

      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  });

  router.post(
    "/contacts/:user_id/accept/:contact_id",
    async (req, res, next) => {
      const { user_id, contact_id } = req.params;
      try {
        const user = await db.User.findById(user_id);
        const contact = await db.User.findById(contact_id);

        if (!user || !contact) {
          return res.sendStatus(400);
        }

        if (
          !user.incoming_requests.includes(contact_id) ||
          !contact.outgoing_requests.includes(user_id)
        ) {
          return res.sendStatus(400);
        }

        user.incoming_requests = user.incoming_requests.filter(
          (id) => id !== contact_id
        );
        user.contacts.push(contact_id);

        contact.outgoing_requests = user.outgoing_requests.filter(
          (id) => id !== user_id
        );
        contact.contacts.push(user_id);

        await user.save();
        await contact.save();

        await db.Chat.create({
          users: [
            { _id: user_id, name: user.name },
            { _id: contact_id, name: contact.name },
          ],
          messages: [],
          seenAt: [
            { user_id: user_id, time: new Date() },
            { user_id: contact_id, time: new Date() },
          ],
        });

        res.sendStatus(200);
      } catch (err) {
        next(err);
      }
    }
  );

  router.post(
    "/contacts/:user_id/decline/:contact_id",
    async (req, res, next) => {}
  );

  router.post(
    "/contacts/:user_id/unsend/:contact_id",
    async (req, res, next) => {}
  );
};

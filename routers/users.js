module.exports = (router, db) => {
  router.post("/signup", async (req, res, next) => {
    try {
      let user = await db.User.findOne({ name: req.body.name });
      if (user) {
        console.log(user);
        return res.status(400).json({ message: "This name is taken" });
      }
      user = await User.create(req.body);
      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  });

  router.post("/login", async (req, res, next) => {
    const { name } = req.body;
    try {
      const user = await db.User.findOne({ name });
      if (!user) {
        return res.status(400).json({ message: "This name does not exist." });
      }

      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  });
};

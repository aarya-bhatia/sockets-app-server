const md5 = require("md5");

module.exports = (router, db) => {
  router.get("/users/:user_id", async (req, res, next) => {
    try {
      const user = await db.User.findById(req.params.user_id);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  });

  router.post("/signup", async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide a value for all fields" });
    }
    try {
      let user = await db.User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "This name or email is taken" });
      }
      user = await db.User.create({ name, email, password: md5(password) });
      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  });

  router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await db.User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Email not found" });
      }
      if (user.password === md5(password)) {
        return res.status(200).json(user);
      } else {
        return res.status(400).json({ message: "Wrong Password" });
      }
    } catch (err) {
      next(err);
    }
  });
};

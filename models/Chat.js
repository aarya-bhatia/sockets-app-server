module.exports = (mongoose) => {
  const chatSchema = new mongoose.Schema(
    {
      users: [
        {
          _id: String,
          name: String,
        },
      ],
      messages: [],
    },
    { timestamps: true }
  );
  return mongoose.model("Chat", chatSchema);
};

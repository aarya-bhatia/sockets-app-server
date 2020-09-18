module.exports = (mongoose) => {
  const messageSchema = new mongoose.Schema({
    content: String,
    author_id: String,
    author_name: String,
    date: String,
    time: String,
    seenBy: [],
    likedBy: [],
    replyTo: mongoose.Types.ObjectId,
  });

  const chatSchema = new mongoose.Schema(
    {
      users: [
        {
          _id: String,
          name: String,
        },
      ],
      messages: [messageSchema],
    },
    { timestamps: true }
  );
  return mongoose.model("Chat", chatSchema);
};

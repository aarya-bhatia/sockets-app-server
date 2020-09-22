module.exports = (mongoose) => {
  const messageSchema = new mongoose.Schema({
    chat_id: mongoose.Types.ObjectId,
    content: String,
    author_id: Number,
    author_name: String,
    date: Date,
    time: String,
    seenBy: [],
    likedBy: [],
    replyTo: mongoose.Types.ObjectId,
  });
  return mongoose.model("Message", messageSchema);
};

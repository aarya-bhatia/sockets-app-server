module.exports = (mongoose) => {
  const userSchema = new mongoose.Schema(
    {
      _id: String,
      name: {
        type: String,
        required: true,
      },
      password: String,
      email: String,
      contacts: [],
      outgoing_requests: [],
      incoming_requests: [],
    },
    { timestamps: true }
  );
  return mongoose.model("User", userSchema);
};

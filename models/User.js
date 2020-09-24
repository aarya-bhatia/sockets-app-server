module.exports = (mongoose) => {
  const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      email: {
        type: String,
      },
      contacts: [],
      outgoing_requests: [],
      incoming_requests: [],
    },
    { timestamps: true }
  );
  return mongoose.model("User", userSchema);
};

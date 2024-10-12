import mongoose from "mongoose";

const newsletter = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Newsletter =
  mongoose.models.Newsletter || mongoose.model("Newsletter", newsletter);

export default Newsletter;

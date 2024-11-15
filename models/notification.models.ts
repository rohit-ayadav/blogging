import mongoose from "mongoose";

// This is the schema for the notification Subscription

const notificationSchema = new mongoose.Schema({
  subscription: {
    type: Object,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;

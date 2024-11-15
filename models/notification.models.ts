import mongoose from "mongoose";
import webpush from "web-push";

// This is the schema for the notification Subscription
interface NotificationModel {
  subscription: webpush.PushSubscription;
  active: boolean;
  lastSuccess?: Date;
  lastFailure?: Date;
  successCount: number;
  failureCount: number;
  vibrate?: boolean;
}

// vibrate: z.boolean().optional(),

const notificationSchema = new mongoose.Schema<NotificationModel>({
  subscription: {
    type: Object,
    required: true
  },
  active: {
    type: Boolean,
    required: true,
    default: true
  },
  lastSuccess: {
    type: Date
  },
  lastFailure: {
    type: Date
  },
  successCount: {
    type: Number,
    required: true,
    default: 0
  },
  failureCount: {
    type: Number,
    required: true,
    default: 0
  },
  vibrate: {
    type: Boolean,
    required: false,
    default: true
  }
});

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;

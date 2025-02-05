import mongoose from "mongoose";

const sendOtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiredAt: {
        type: Date,
        default: null,
    },
    isUsed: {
        type: Boolean,
        default: false
    }
});

sendOtpSchema.pre('save', function (next) {
    if (!this.expiredAt) {
        this.expiredAt = new Date(Date.now() + 5 * 60 * 1000);
    }
    next();
});

sendOtpSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 300 });

sendOtpSchema.index({ email: 1, isUsed: 1 });

export default mongoose.models.SendOtp || mongoose.model('SendOtp', sendOtpSchema);
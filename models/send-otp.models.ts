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
        this.expiredAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    }
    next();
});

// Add TTL index for expiredAt field to expire documents after 5 minutes
sendOtpSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 300 }); // Delete token after 5 minutes

// Additional index for email field to make search faster
sendOtpSchema.index({ email: 1 , isUsed: 1 });

export default mongoose.models.SendOtp || mongoose.model('SendOtp', sendOtpSchema);
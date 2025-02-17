import mongoose from "mongoose";
import Blog from "./blogs.models";

const monthlyStatsSchema = new mongoose.Schema({
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    },
    month: {
        type: String, // Format "YYYY-MM"
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    }
});

// Ensure the blog and month combination is unique
monthlyStatsSchema.index({ blog: 1, month: 1 }, { unique: true });

const MonthlyStats = mongoose.models.MonthlyStats || mongoose.model("MonthlyStats", monthlyStatsSchema);
export default MonthlyStats;
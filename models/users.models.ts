import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function(this: any) {
      return this.provider === "credentials";
    }
  },
  image: {
    type: String
  },
  provider: {
    type: String,
    enum: ["google", "github", "credentials"],
    default: "credentials"
  },
  providerId: {
    type: String
  },

  username: {
    type: String,
    unique: false,
    required: false
  },
  bio: {
    type: String,
    default: ""
  },
  follower: {
    type: Number,
    default: 0
  },
  following: {
    type: Number,
    default: 0
  },
  noOfBlogs: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  theme: {
    type: String,
    default: "light"
  },
  role: {
    type: String,
    default: "user",
    required: true
  }
});

userSchema.pre("save", async function(next) {
  this.updatedAt = new Date();

  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    if (typeof this.password === "string") {
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  next();
});

userSchema.methods.comparePassword = async function(password: string) {
  if (typeof this.password !== "string") {
    throw new Error("Password is not a string");
  }
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

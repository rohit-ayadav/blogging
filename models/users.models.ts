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
    required: function (this: any) {
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
    default: "system"
  },
  role: {
    type: String,
    default: "user",
    required: true
  },
  resetPasswordToken: {
    type: String,
    required: false,
    trim: true,
    default: "",
  },
  resetPasswordTokenDate: {
    type: Date,
    required: false,
    default: null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  website: {
    type: String,
    default: ""
  },
  socialLinks: {
    github: {
      type: String,
      default: ""
    },
    twitter: {
      type: String,
      default: ""
    },
    linkedin: {
      type: String,
      default: ""
    },
    facebook: {
      type: String,
      default: ""
    },
    instagram: {
      type: String,
      default: ""
    }
  }
});

// Delete reset password token after password reset
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.resetPasswordToken = "";
  }
  // if provider is not credentials, then set email verified to true
  if (this.isModified("provider") && this.provider !== "credentials") {
    this.isEmailVerified = true
  }
  next(); // move to the next middleware
});

// Add TTL index for resetPasswordToken
userSchema.index({ resetPasswordToken: 1 }, { expireAfterSeconds: 600 }); // Delete token after 10 minutes
userSchema.index({ resetPasswordTokenDate: 1 }, { expireAfterSeconds: 600 }); // Delete token date after 10 minutes

userSchema.pre("save", async function (next) {
  this.updatedAt = new Date();

  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    if (typeof this.password === "string") {
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  if (typeof this.password !== "string") {
    throw new Error("Kindly login using your social account");
  }
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

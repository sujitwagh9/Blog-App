import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Import jwt

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username required!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email required!"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["author", "admin", "reader"],
      default: "reader",
    },
    refreshTokens: {
      type:[String],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare if the given password matches the stored password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.JWT_ACCESS_TOKEN_SECRET, // Use secret from .env
    { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY || "15m" } // Default expiry
  );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_REFRESH_TOKEN_SECRET, // Use secret from .env
    { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY || "7d" } // Default expiry
  );
};

// Create a model based on the schema
const User = mongoose.model("User", userSchema);

export { User };

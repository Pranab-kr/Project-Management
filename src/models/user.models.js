import { Schema, model } from "mongoose";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { createHmac, randomBytes } from "crypto";

const userSchema = new Schema(
  {
    avatar: {
      type: {
        url: String,
        localpath: String,
      },
      default: "https://placehold.co/200x200",
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshTokens: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
  },
  { timestamps: true },
);

//hash password before saving hook
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//compare password method attached to user schema
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { userId: this._id, email: this.email, username: this.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { userId: this._id, email: this.email, username: this.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN },
  );
};

userSchema.methods.generateTemporaryToken = function () {
  const unhashedToken = randomBytes(20).toString("hex");

  const hashedToken = createHmac("sha256")
    .update(unhashedToken)
    .digest("hex");

  const tokenExpiry = Date.now() + 20 * 60 * 1000; // 20 minutes

  return { unhashedToken, hashedToken, tokenExpiry };
};

export const User = model("User", userSchema);

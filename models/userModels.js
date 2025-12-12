const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Full Name is required!"],
      trim: true,
      minLength: [3, "Full Name must have at least 3 characters!"],
    },

    email: {
      type: String,
      trim: true,
      unique: false, // not required for login now
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Password must be provided!"],
      trim: true,
      select: false,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required!"],
      unique: true,
      match: [/^\d+$/, "Phone number must contain only numbers!"],
      minLength: [7, "Phone number must be at least 7 digits!"],
      maxLength: [15, "Phone number cannot be more than 15 digits!"],
    },

    userCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["Admin", "Manager", "User"],
      default: "Admin",
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Banned"],
      default: "Active",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

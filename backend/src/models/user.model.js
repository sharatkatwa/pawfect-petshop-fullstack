const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot be more than 50 characters long"],
      match: [/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"],
    },
    age: {
      type: Number,
      min: [1, "Age must be at least 1"],
      max: [120, "Age cannot be more than 120"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      maxlength: [100, "Password cannot be more than 100 characters long"],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid 10 digit phone number"],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, "Address cannot be more than 200 characters long"],
    },
    role: {
      type: String,
      enum: ["customer", "seller"],
      default: "customer",
    },
    admin:{
      type:Boolean,
      default:false
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

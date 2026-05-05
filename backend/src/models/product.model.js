const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller is required"],
    },
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters long"],
      maxlength: [100, "Product name cannot be more than 100 characters long"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [1000, "Description cannot be more than 1000 characters long"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: {
        values: ["pet", "food", "toy", "grooming", "medicine", "accessory", "other"],
        message: "Category must be pet, food, toy, grooming, medicine, accessory, or other",
      },
      default: "other"
    },
    petType: {
      type: String,
      enum: {
        values: ["dog", "cat", "bird", "fish", "rabbit", "hamster", "other", ""],
        message: "Pet type must be dog, cat, bird, fish, rabbit, hamster, other, or empty",
      },
      default: "dog",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 1,
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    age: {
      type: Number,
      min: [0, "Pet age cannot be negative"],
    },
    breed: {
      type: String,
      trim: true,
      maxlength: [50, "Breed cannot be more than 50 characters long"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "unknown"],
      default: "unknown",
    },
    isVaccinated: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["available", "sold", "out_of_stock"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

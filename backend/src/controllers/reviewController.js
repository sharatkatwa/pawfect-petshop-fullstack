const Review = require("../models/review.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const apiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const updateProductRatingStats = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    : 0;

  await Product.findByIdAndUpdate(productId, {
    averageRating: Number(averageRating.toFixed(1)),
    totalReviews,
  });
};

const createReview = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const { rating, comment } = req.body;

  if (!req.user) {
    throw new apiError(401, "Login required to add review");
  }

  const reviewRating = Number(rating);

  if (!Number.isInteger(reviewRating) || reviewRating < 1 || reviewRating > 5) {
    throw new apiError(400, "Rating must be a whole number between 1 and 5");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new apiError(404, "Product not found");
  }

  if (product.seller.toString() === req.user._id.toString()) {
    throw new apiError(400, "Seller cannot review their own product");
  }

  const purchasedOrder = await Order.findOne({
    buyer: req.user._id,
    status: "delivered",
    "items.product": productId,
  });

  if (!purchasedOrder) {
    throw new apiError(403, "Only users who received this product can review it");
  }

  const existingReview = await Review.findOne({
    user: req.user._id,
    product: productId,
  });

  if (existingReview) {
    throw new apiError(400, "You already reviewed this product");
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating: reviewRating,
    comment,
  });

  await updateProductRatingStats(productId);

  const populatedReview = await Review.findById(review._id).populate(
    "user",
    "name",
  );

  return res.status(201).json({
    success: true,
    message: "Review added successfully",
    review: populatedReview,
  });
});

const getProductReviews = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const product = await Product.findById(productId);

  if (!product) {
    throw new apiError(404, "Product not found");
  }

  const skip = (Number(page) - 1) * Number(limit);

  const reviews = await Review.find({ product: productId })
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const totalReviews = await Review.countDocuments({ product: productId });

  return res.status(200).json({
    success: true,
    message: "Reviews fetched successfully",
    page: Number(page),
    limit: Number(limit),
    totalReviews,
    totalPages: Math.ceil(totalReviews / Number(limit)),
    averageRating: product.averageRating,
    reviews,
  });
});

const deleteReview = asyncHandler(async (req, res) => {
  const { id: productId, reviewId } = req.params;

  if (!req.user) {
    throw new apiError(401, "Login required to delete review");
  }

  const review = await Review.findOne({
    _id: reviewId,
    product: productId,
  });

  if (!review) {
    throw new apiError(404, "Review not found");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new apiError(404, "Product not found");
  }

  const isReviewOwner = review.user.toString() === req.user._id.toString();
  const isProductSeller = product.seller.toString() === req.user._id.toString();

  if (!isReviewOwner && !isProductSeller && !req.user.admin) {
    throw new apiError(403, "You are not allowed to delete this review");
  }

  await Review.findByIdAndDelete(reviewId);
  await updateProductRatingStats(productId);

  return res.status(200).json({
    success: true,
    message: "Review deleted successfully",
    review,
  });
});

module.exports = {
  createReview,
  getProductReviews,
  deleteReview,
};

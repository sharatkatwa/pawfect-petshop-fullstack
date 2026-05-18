const Wishlist = require("../models/wishlist.model");
const Product = require("../models/product.model");
const apiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const wishlistProductFields =
  "productName price images category petType stock status";

const getOrCreateWishlist = async (buyerId) => {
  let wishlist = await Wishlist.findOne({ buyer: buyerId });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      buyer: buyerId,
      items: [],
    });
  }

  return wishlist;
};

const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!req.user) {
    throw new apiError(401, "Login required to add product to wishlist");
  }

  if (!productId) {
    throw new apiError(400, "Product id is required");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new apiError(404, "Product not found");
  }

  const wishlist = await getOrCreateWishlist(req.user._id);
  const alreadyExists = wishlist.items.some(
    (item) => item.product.toString() === productId,
  );

  if (alreadyExists) {
    throw new apiError(400, "Product already exists in wishlist");
  }

  wishlist.items.push({ product: product._id });
  await wishlist.save();

  const populatedWishlist = await Wishlist.findById(wishlist._id).populate(
    "items.product",
    wishlistProductFields,
  );

  return res.status(200).json({
    success: true,
    message: "Product added to wishlist successfully",
    wishlist: populatedWishlist,
  });
});

const getWishlist = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new apiError(401, "Login required to view wishlist");
  }

  const wishlist = await getOrCreateWishlist(req.user._id);

  const populatedWishlist = await Wishlist.findById(wishlist._id).populate(
    "items.product",
    wishlistProductFields,
  );

  return res.status(200).json({
    success: true,
    message: "Wishlist fetched successfully",
    wishlist: populatedWishlist,
  });
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!req.user) {
    throw new apiError(401, "Login required to remove wishlist item");
  }

  const wishlist = await Wishlist.findOne({ buyer: req.user._id });

  if (!wishlist) {
    throw new apiError(404, "Wishlist not found");
  }

  const initialLength = wishlist.items.length;
  wishlist.items = wishlist.items.filter(
    (item) => item.product.toString() !== productId,
  );

  if (wishlist.items.length === initialLength) {
    throw new apiError(404, "Product not found in wishlist");
  }

  await wishlist.save();

  const populatedWishlist = await Wishlist.findById(wishlist._id).populate(
    "items.product",
    wishlistProductFields,
  );

  return res.status(200).json({
    success: true,
    message: "Product removed from wishlist successfully",
    wishlist: populatedWishlist,
  });
});

const clearWishlist = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new apiError(401, "Login required to clear wishlist");
  }

  const wishlist = await getOrCreateWishlist(req.user._id);

  wishlist.items = [];
  await wishlist.save();

  return res.status(200).json({
    success: true,
    message: "Wishlist cleared successfully",
    wishlist,
  });
});

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
};

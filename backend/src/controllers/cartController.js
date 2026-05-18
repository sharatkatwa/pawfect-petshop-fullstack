const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const apiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const cartProductFields =
  "productName price images category petType stock status";

const calculateTotalAmount = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const getOrCreateCart = async (buyerId) => {
  let cart = await Cart.findOne({ buyer: buyerId });

  if (!cart) {
    cart = await Cart.create({
      buyer: buyerId,
      items: [],
      totalAmount: 0,
    });
  }

  return cart;
};

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!req.user) {
    throw new apiError(401, "Login required to add product to cart");
  }

  if (!productId) {
    throw new apiError(400, "Product id is required");
  }

  const cartQuantity = Number(quantity);

  if (!Number.isInteger(cartQuantity) || cartQuantity < 1) {
    throw new apiError(400, "Quantity must be a positive whole number");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new apiError(404, "Product not found");
  }

  if (product.status !== "available") {
    throw new apiError(400, `${product.productName} is not available`);
  }

  const cart = await getOrCreateCart(req.user._id);
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );

  const finalQuantity = existingItem
    ? existingItem.quantity + cartQuantity
    : cartQuantity;

  if (product.stock < finalQuantity) {
    throw new apiError(
      400,
      `Only ${product.stock} item(s) available for ${product.productName}`,
    );
  }

  if (existingItem) {
    existingItem.quantity = finalQuantity;
    existingItem.price = product.price;
  } else {
    cart.items.push({
      product: product._id,
      quantity: cartQuantity,
      price: product.price,
    });
  }

  cart.totalAmount = calculateTotalAmount(cart.items);
  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate(
    "items.product",
    cartProductFields,
  );

  return res.status(200).json({
    success: true,
    message: "Product added to cart successfully",
    cart: populatedCart,
  });
});

const getCart = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new apiError(401, "Login required to view cart");
  }

  const cart = await getOrCreateCart(req.user._id);

  const populatedCart = await Cart.findById(cart._id).populate(
    "items.product",
    cartProductFields,
  );

  return res.status(200).json({
    success: true,
    message: "Cart fetched successfully",
    cart: populatedCart,
  });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!req.user) {
    throw new apiError(401, "Login required to update cart");
  }

  const cartQuantity = Number(quantity);

  if (!Number.isInteger(cartQuantity) || cartQuantity < 1) {
    throw new apiError(400, "Quantity must be a positive whole number");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new apiError(404, "Product not found");
  }

  if (product.status !== "available") {
    throw new apiError(400, `${product.productName} is not available`);
  }

  if (product.stock < cartQuantity) {
    throw new apiError(
      400,
      `Only ${product.stock} item(s) available for ${product.productName}`,
    );
  }

  const cart = await Cart.findOne({ buyer: req.user._id });

  if (!cart) {
    throw new apiError(404, "Cart not found");
  }

  const cartItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );

  if (!cartItem) {
    throw new apiError(404, "Product not found in cart");
  }

  cartItem.quantity = cartQuantity;
  cartItem.price = product.price;
  cart.totalAmount = calculateTotalAmount(cart.items);
  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate(
    "items.product",
    cartProductFields,
  );

  return res.status(200).json({
    success: true,
    message: "Cart item updated successfully",
    cart: populatedCart,
  });
});

const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!req.user) {
    throw new apiError(401, "Login required to remove cart item");
  }

  const cart = await Cart.findOne({ buyer: req.user._id });

  if (!cart) {
    throw new apiError(404, "Cart not found");
  }

  const initialLength = cart.items.length;
  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId,
  );

  if (cart.items.length === initialLength) {
    throw new apiError(404, "Product not found in cart");
  }

  cart.totalAmount = calculateTotalAmount(cart.items);
  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate(
    "items.product",
    cartProductFields,
  );

  return res.status(200).json({
    success: true,
    message: "Product removed from cart successfully",
    cart: populatedCart,
  });
});

const clearCart = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new apiError(401, "Login required to clear cart");
  }

  const cart = await getOrCreateCart(req.user._id);

  cart.items = [];
  cart.totalAmount = 0;
  await cart.save();

  return res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
    cart,
  });
});

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};

const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const apiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const orderProductFields =
  "productName price images category petType status seller";

const canAccessOrder = (order, user) => {
  const userId = user._id.toString();

  if (user.admin) return true;
  if (
    order.buyer._id?.toString() === userId ||
    order.buyer.toString() === userId
  ) {
    return true;
  }

  return order.items.some((item) => {
    const product = item.product;
    return product?.seller?.toString() === userId;
  });
};

const restoreOrderStock = async (order) => {
  for (const item of order.items) {
    const productId = item.product._id || item.product;
    const product = await Product.findById(productId);

    if (!product) continue;

    product.stock += item.quantity;
    product.status = "available";
    await product.save();
  }
};

const getPaymentDetails = (paymentMethod = "cod") => {
  const allowedPaymentMethods = ["cod", "razorpay"];

  if (!allowedPaymentMethods.includes(paymentMethod)) {
    throw new apiError(400, "Invalid payment method");
  }

  return {
    paymentMethod,
    paymentStatus: "pending",
    paid: false,
  };
};

const prepareOrderItems = async (orderItems) => {
  const validatedItems = [];
  const preparedItems = [];
  let totalAmount = 0;

  for (const item of orderItems) {
    const orderQuantity = Number(item.quantity || 1);
    const orderedProductId = item.product || item.productId;

    if (!orderedProductId) {
      throw new apiError(400, "Product id is required for every order item");
    }

    if (!Number.isInteger(orderQuantity) || orderQuantity < 1) {
      throw new apiError(400, "Quantity must be a positive whole number");
    }

    const product = await Product.findById(orderedProductId);

    if (!product) {
      throw new apiError(404, "Product not found");
    }

    if (product.status !== "available") {
      throw new apiError(400, `${product.productName} is not available`);
    }

    if (product.stock < orderQuantity) {
      throw new apiError(
        400,
        `Only ${product.stock} item(s) available for ${product.productName}`,
      );
    }

    validatedItems.push({ product, quantity: orderQuantity });
  }

  for (const item of validatedItems) {
    const { product, quantity: orderQuantity } = item;

    preparedItems.push({
      product: product._id,
      quantity: orderQuantity,
      price: product.price,
    });

    totalAmount += product.price * orderQuantity;

    product.stock -= orderQuantity;
    if (product.stock === 0) {
      product.status = product.category === "pet" ? "sold" : "out_of_stock";
    }

    await product.save();
  }

  return { preparedItems, totalAmount };
};

const getOrderItemsFromRequest = async (body, userId) => {
  const { source = "cart", items, productId, quantity = 1 } = body;

  if (source === "cart") {
    const cart = await Cart.findOne({ buyer: userId });

    if (!cart || !cart.items.length) {
      throw new apiError(400, "Cart is empty");
    }

    return { orderItems: cart.items, source };
  }

  const orderItems = Array.isArray(items)
    ? items
    : productId
      ? [{ product: productId, quantity }]
      : [];

  if (!orderItems.length) {
    throw new apiError(400, "Order must contain at least one product");
  }

  return { orderItems, source: "direct" };
};

const previewOrderItems = async (orderItems) => {
  let totalAmount = 0;

  for (const item of orderItems) {
    const orderQuantity = Number(item.quantity || 1);
    const orderedProductId = item.product || item.productId;

    if (!orderedProductId) {
      throw new apiError(400, "Product id is required for every order item");
    }

    if (!Number.isInteger(orderQuantity) || orderQuantity < 1) {
      throw new apiError(400, "Quantity must be a positive whole number");
    }

    const product = await Product.findById(orderedProductId);

    if (!product) {
      throw new apiError(404, "Product not found");
    }

    if (product.status !== "available") {
      throw new apiError(400, `${product.productName} is not available`);
    }

    if (product.stock < orderQuantity) {
      throw new apiError(
        400,
        `Only ${product.stock} item(s) available for ${product.productName}`,
      );
    }

    totalAmount += product.price * orderQuantity;
  }

  return totalAmount;
};

const createRazorpayOrder = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new apiError(401, "Login required to create Razorpay order");
  }

  const { orderItems, source } = await getOrderItemsFromRequest(
    req.body,
    req.user._id,
  );
  const totalAmount = await previewOrderItems(orderItems);

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(totalAmount * 100),
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: {
      buyerId: req.user._id.toString(),
      source,
    },
  });

  return res.status(201).json({
    success: true,
    message: "Razorpay order created successfully",
    totalAmount,
    razorpayOrder,
  });
});

const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    shippingAddress,
  } = req.body;

  if (!req.user) {
    throw new apiError(401, "Login required to verify payment");
  }

  if (!shippingAddress?.phone || !shippingAddress?.address) {
    throw new apiError(400, "Shipping phone and address are required");
  }

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new apiError(400, "Razorpay payment details are required");
  }

  const existingOrder = await Order.findOne({
    razorpayPaymentId: razorpay_payment_id,
  });

  if (existingOrder) {
    throw new apiError(400, "Payment already verified");
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    throw new apiError(400, "Invalid Razorpay payment signature");
  }

  const { orderItems, source } = await getOrderItemsFromRequest(
    req.body,
    req.user._id,
  );
  const expectedTotalAmount = await previewOrderItems(orderItems);
  const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);

  if (razorpayOrder.amount !== Math.round(expectedTotalAmount * 100)) {
    throw new apiError(400, "Razorpay amount does not match order amount");
  }

  const { preparedItems, totalAmount } = await prepareOrderItems(orderItems);

  const order = await Order.create({
    buyer: req.user._id,
    items: preparedItems,
    totalAmount,
    shippingAddress,
    paymentMethod: "razorpay",
    paymentStatus: "paid",
    paid: true,
    paidAt: new Date(),
    status: "confirmed",
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
  });

  if (source === "cart") {
    const cart = await Cart.findOne({ buyer: req.user._id });

    if (cart) {
      cart.items = [];
      cart.totalAmount = 0;
      await cart.save();
    }
  }

  const populatedOrder = await Order.findById(order._id).populate(
    "items.product",
    orderProductFields,
  );

  return res.status(201).json({
    success: true,
    message: "Payment verified and order placed successfully",
    order: populatedOrder,
  });
});

const createOrder = asyncHandler(async (req, res) => {
  const {
    items,
    productId,
    quantity = 1,
    shippingAddress,
    paymentMethod = "cod",
    razorpayOrderId,
  } = req.body;

  if (!req.user) {
    throw new apiError(401, "Login required to place an order");
  }

  if (!shippingAddress?.phone || !shippingAddress?.address) {
    throw new apiError(400, "Shipping phone and address are required");
  }

  const orderItems = Array.isArray(items)
    ? items
    : productId
      ? [{ product: productId, quantity }]
      : [];

  if (!orderItems.length) {
    throw new apiError(400, "Order must contain at least one product");
  }

  const { preparedItems, totalAmount } = await prepareOrderItems(orderItems);
  const paymentDetails = getPaymentDetails(paymentMethod);

  const order = await Order.create({
    buyer: req.user._id,
    items: preparedItems,
    totalAmount,
    shippingAddress,
    ...paymentDetails,
    razorpayOrderId: paymentMethod === "razorpay" ? razorpayOrderId : undefined,
  });

  const populatedOrder = await Order.findById(order._id).populate(
    "items.product",
    "productName price images category petType status",
  );

  return res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order: populatedOrder,
  });
});

const getMyOrders = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new apiError(401, "Login required to view orders");
  }

  const orders = await Order.find({ buyer: req.user._id })
    .populate("items.product", orderProductFields)
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    totalOrders: orders.length,
    orders,
  });
});

const getSellerOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  if (!req.user) {
    throw new apiError(401, "Login required to view seller orders");
  }

  if (req.user.role !== "seller" && !req.user.admin) {
    throw new apiError(403, "Only sellers can view seller orders");
  }

  const sellerProductIds = req.user.admin
    ? []
    : await Product.find({ seller: req.user._id }).distinct("_id");

  const query = {};

  if (!req.user.admin) {
    query["items.product"] = { $in: sellerProductIds };
  }

  if (status) {
    query.status = status;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [orders, totalOrders] = await Promise.all([
    Order.find(query)
      .populate("buyer", "name email phone address")
      .populate("items.product", orderProductFields)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Order.countDocuments(query),
  ]);

  return res.status(200).json({
    success: true,
    message: "Seller orders fetched successfully",
    page: Number(page),
    limit: Number(limit),
    totalOrders,
    totalPages: Math.ceil(totalOrders / Number(limit)),
    orders,
  });
});

const checkoutFromCart = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = "cod", razorpayOrderId } = req.body;

  if (!req.user) {
    throw new apiError(401, "Login required to checkout from cart");
  }

  if (!shippingAddress?.phone || !shippingAddress?.address) {
    throw new apiError(400, "Shipping phone and address are required");
  }

  const cart = await Cart.findOne({ buyer: req.user._id });

  if (!cart || !cart.items.length) {
    throw new apiError(400, "Cart is empty");
  }

  const { preparedItems, totalAmount } = await prepareOrderItems(cart.items);
  const paymentDetails = getPaymentDetails(paymentMethod);

  const order = await Order.create({
    buyer: req.user._id,
    items: preparedItems,
    totalAmount,
    shippingAddress,
    ...paymentDetails,
    razorpayOrderId: paymentMethod === "razorpay" ? razorpayOrderId : undefined,
  });

  cart.items = [];
  cart.totalAmount = 0;
  await cart.save();

  const populatedOrder = await Order.findById(order._id).populate(
    "items.product",
    orderProductFields,
  );

  return res.status(201).json({
    success: true,
    message: "Checkout completed successfully",
    order: populatedOrder,
  });
});

const cancelOrder = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new apiError(401, "Login required to cancel order");
  }

  const orderId = req.body.orderId || req.params.id;

  if (!orderId) {
    throw new apiError(400, "Order id is required");
  }

  const order = await Order.findById(orderId).populate(
    "items.product",
    orderProductFields,
  );

  if (!order) {
    throw new apiError(404, "Order not found");
  }

  const isBuyer = order.buyer.toString() === req.user._id.toString();

  if (!isBuyer && !req.user.admin) {
    throw new apiError(403, "You are not allowed to cancel this order");
  }

  if (order.status === "cancelled") {
    throw new apiError(400, "Order is already cancelled");
  }

  if (!["pending", "confirmed"].includes(order.status)) {
    throw new apiError(
      400,
      "Only pending or confirmed orders can be cancelled",
    );
  }

  await restoreOrderStock(order);

  order.status = "cancelled";
  await order.save();

  return res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    order,
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowedStatuses = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!req.user) {
    throw new apiError(401, "Login required to update order status");
  }

  if (!allowedStatuses.includes(status)) {
    throw new apiError(400, "Invalid order status");
  }

  const order = await Order.findById(id).populate(
    "items.product",
    orderProductFields,
  );

  if (!order) {
    throw new apiError(404, "Order not found");
  }

  const isRelatedSeller = order.items.some((item) => {
    return item.product?.seller?.toString() === req.user._id.toString();
  });

  if (!req.user.admin && !isRelatedSeller) {
    throw new apiError(403, "You are not allowed to update this order status");
  }

  if (order.status === "cancelled") {
    throw new apiError(400, "Cancelled order status cannot be changed");
  }

  if (status === "cancelled") {
    if (!["pending", "confirmed"].includes(order.status)) {
      throw new apiError(
        400,
        "Only pending or confirmed orders can be cancelled",
      );
    }

    await restoreOrderStock(order);
  }

  order.status = status;
  await order.save();

  const updatedOrder = await Order.findById(order._id)
    .populate("buyer", "name email phone address")
    .populate("items.product", orderProductFields);

  return res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    order: updatedOrder,
  });
});

const getSingleOrder = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new apiError(401, "Login required to view order");
  }

  const { id } = req.params;

  const order = await Order.findById(id)
    .populate("buyer", "name email phone address")
    .populate("items.product", orderProductFields);

  if (!order) {
    throw new apiError(404, "Order not found");
  }

  if (!canAccessOrder(order, req.user)) {
    throw new apiError(403, "You are not allowed to view this order");
  }

  return res.status(200).json({
    success: true,
    message: "Order fetched successfully",
    order,
  });
});

module.exports = {
  createOrder,
  checkoutFromCart,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getMyOrders,
  getSellerOrders,
  cancelOrder,
  updateOrderStatus,
  getSingleOrder,
};

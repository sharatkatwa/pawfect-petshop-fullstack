const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const {
  createOrder,
  checkoutFromCart,
  cancelOrder,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus,
  getSingleOrder,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", protect, createOrder);
router.post("/from-cart", protect, checkoutFromCart);
router.post("/cancel", protect, cancelOrder);
router.get("/my-order", protect, getMyOrders);
router.get("/seller-orders", protect, getSellerOrders);
router.patch("/:id/status", protect, updateOrderStatus);
router.get("/:id", protect, getSingleOrder);

module.exports = router;

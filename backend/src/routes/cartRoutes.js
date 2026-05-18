const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.patch("/item/:productId", protect, updateCartItem);
router.delete("/item/:productId", protect, removeCartItem);
router.delete("/clear", protect, clearCart);

module.exports = router;

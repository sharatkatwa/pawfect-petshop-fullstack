const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");

const router = express.Router();

router.post("/:productId", protect, addToWishlist);
router.get("/", protect, getWishlist);
router.delete("/:productId", protect, removeFromWishlist);
router.delete("/", protect, clearWishlist);

module.exports = router;

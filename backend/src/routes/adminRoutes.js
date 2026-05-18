const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const {
  getAdminStats,
  getAdminUsers,
  getAdminOrders,
  getAdminProducts,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/stats", protect, getAdminStats);
router.get("/users", protect, getAdminUsers);
router.get("/orders", protect, getAdminOrders);
router.get("/products", protect, getAdminProducts);

module.exports = router;

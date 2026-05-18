const { Router } = require("express");
const {
  getAllProduct,
  getMyProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const {
  createReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middlewares/auth.middleware");
const { upload } = require("../config/cloudinaryStorage");

const router = Router();

router.get("/all", getAllProduct);
router.get("/my-products", protect, getMyProducts);
router.post("/create", protect, upload.array("images", 5), createProduct);
router.patch("/update/:id", protect, updateProduct);
router.delete("/remove/:id", protect, deleteProduct);
router.get("/:id", getSingleProduct);

// review routes
router.post("/:id/review", protect, createReview);
router.get("/:id/reviews", getProductReviews);
router.delete("/:id/review/:reviewId", protect, deleteReview);

module.exports = router;

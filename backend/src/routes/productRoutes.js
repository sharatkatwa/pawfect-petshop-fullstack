const { Router } = require("express");
const {
  getAllProduct,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { authMiddleware } = require("../controllers/authController");
const { upload } = require("../config/cloudinaryStorage");

const router = Router();

router.get("/all",authMiddleware, getAllProduct);
router.get("/:id", getSingleProduct);
router.post("/create",upload.array('images',5), createProduct);
router.patch("/update", updateProduct);
router.delete("/remove/:id", deleteProduct);

module.exports = router
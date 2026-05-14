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

router.get("/all", getAllProduct);
router.get("/:id", getSingleProduct);
router.post("/create",authMiddleware,upload.array('images',5), createProduct);
router.patch("/update/:id", authMiddleware, updateProduct);
router.delete("/remove/:id",authMiddleware, deleteProduct);

module.exports = router

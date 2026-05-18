const { Router } = require("express");
const {
  login,
  logout,
  updateUser,
  deleteUser,
  signup,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middlewares/auth.middleware");

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", logout);
router.patch("/update/:id", protect, updateUser);
router.delete("/delete/:id", protect, deleteUser);

module.exports = router;

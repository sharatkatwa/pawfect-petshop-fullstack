const { Router } = require("express");
const {
  login,
  logout,
  updateUser,
  deleteUser,
  signup,
  authMiddleware,
  getMe,
} = require("../controllers/authController");

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.post("/logout", logout);
router.patch("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

module.exports = router;

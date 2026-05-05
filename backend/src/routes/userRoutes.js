const { Router } = require("express");
const { login, logout, updateUser, deleteUser, signup } = require("../controllers/authController");

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.patch("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

module.exports = router
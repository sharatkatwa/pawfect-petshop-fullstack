const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const apiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

// JWT DECODE FUNCTION
const jwtDecode = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        reject(new apiError(401, "Not authorized, invalid token"));
        return;
      }

      resolve(decoded);
    });
  });
};

const signup = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, email, password, cpassword: confirmPassword } = req.body;

  if (password !== confirmPassword)
    throw new apiError(400, "Password Does't match");

  const existingUser = await User.findOne({ email });

  if (existingUser) throw new apiError(400, "User already Exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ ...req.body, password: hashedPassword });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json({
    message: "signup successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new apiError(400, "Invalid Email or Password");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new apiError(400, "Invalid Email or Password");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "Login successfull",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});



const logout = asyncHandler((req, res) => {
  res.clearCookie("token");

  res.status(200).json({
    message: "Logged out successfully",
  });
});

const getMe = asyncHandler(async (req, res) => {
  if (req.user)
    return res
      .status(200)
      .json({ message: "user fetched successfull", user: req.user });
  throw new apiError(401, "Login to get your details");
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!req.user) {
    throw new apiError(401, "Login required to update profile");
  }

  const isOwner = req.user._id.toString() === id;
  const isAdmin = req.user.admin;

  if (!isOwner && !isAdmin) {
    throw new apiError(403, "You are not allowed to update this user");
  }

  const allowedFields = ["name", "age", "phone", "address"];
  const updateData = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  if (!Object.keys(updateData).length) {
    throw new apiError(400, "No valid fields provided for update");
  }

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new apiError(404, "User not found");
  }

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    user: updatedUser,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!req.user) {
    throw new apiError(401, "Login required to delete account");
  }

  const isOwner = req.user._id.toString() === id;
  const isAdmin = req.user.admin;

  if (!isOwner && !isAdmin) {
    throw new apiError(403, "You are not allowed to delete this user");
  }

  const deletedUser = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );

  if (!deletedUser) {
    throw new apiError(404, "User not found");
  }

  if (isOwner) {
    res.clearCookie("token");
  }

  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
    user: deletedUser,
  });
});

module.exports = {
  signup,
  login,
  updateUser,
  deleteUser,
  logout,
  getMe,
};

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

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  // token getting code
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  } else {
    throw new apiError(401, "Unauthorized access, token not found");
  }

  // main verification code
  const decoded = await jwtDecode(token);
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new apiError(401, "User not found");
  }
  req.user = user;
  next();
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

const updateUser = asyncHandler(async (req, res) => {});

const deleteUser = asyncHandler(async (req, res) => {});

module.exports = {
  signup,
  login,
  updateUser,
  deleteUser,
  logout,
  authMiddleware,
  getMe,
};

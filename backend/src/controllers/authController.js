const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// JWT DECODE FUNCTION
const jwtDecode = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const signup = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password, cpassword: confirmPassword } = req.body;
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords doesn't match" });
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

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
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

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
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ ERROR: error });
  }
};

const authMiddleware = async (req, res, next) => {
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
    return res
      .status(401)
      .json({ message: "Unauthorized access, Token not found" });
  }

  // main verification code
  try {
    const decoded = await jwtDecode(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Not authorized, invalid token", error });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed", error });
  }
};

const getMe = async (req, res) => {
  try {
    if (req.user)
      return res
        .status(200)
        .json({ message: "user fetched successfull", user: req.user });
    return res.status(401).json({ message: "Login to get your details" });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized access", error });
  }
};

const updateUser = async (req, res) => {};

const deleteUser = async (req, res) => {};

module.exports = {
  signup,
  login,
  updateUser,
  deleteUser,
  logout,
  authMiddleware,
  getMe,
};

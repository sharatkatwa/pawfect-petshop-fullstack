const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const apiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

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

const protect = asyncHandler(async (req, res, next) => {
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

module.exports = { protect };

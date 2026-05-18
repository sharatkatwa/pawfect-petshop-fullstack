const Product = require("../models/product.model");
const apiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const isProductOwnerOrAdmin = (product, user) => {
  return product.seller.toString() === user._id.toString() || user.admin;
};

const createProduct = asyncHandler(async (req, res) => {
  const {
    productName,
    description,
    // category,
    // petType,
    price,
    // stock,
    // images,
    // age,
    // breed,
    // gender,
    // isVaccinated,
    // status,
  } = req.body;
  const images = req.files?.map((image) => image.path) || [];

  if (!req.user) {
    throw new apiError(401, "Login required to add product");
  }

  if (!description || price === undefined || price === null || !productName) {
    throw new apiError(
      400,
      "Mandatory fields are required like productName, seller, description and price",
    );
  }

  // Check USER ROLE
  const user = req.user;
  if (user.role !== "seller" && !user.admin) {
    throw new apiError(403, "You don't have permission to sell products");
  }

  const newProduct = await Product.create({
    ...req.body,
    images,
    seller: user._id,
  });
  return res
    .status(201)
    .json({ status: 201, message: "Product added successfully", newProduct });
});

const getAllProduct = asyncHandler(async (req, res) => {
  const {
    category,
    minPrice,
    maxPrice,
    search,
    page = 1,
    limit = 10,
  } = req.query;
  console.log(req.query);
  const query = {};

  // filter by category
  if (category) {
    query.category = category;
  }

  // filter by price range
  if (minPrice || maxPrice) {
    query.price = {};

    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // search by product name
  if (search) {
    query.productName = { $regex: search, $options: "i" };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const products = await Product.find(query)
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalProducts = await Product.countDocuments(query);

  res.status(200).json({
    success: true,
    page: Number(page),
    limit: Number(limit),
    totalProducts,
    totalPages: Math.ceil(totalProducts / Number(limit)),
    products,
  });
});

const getMyProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  if (!req.user) {
    throw new apiError(401, "Login required to view your products");
  }

  if (req.user.role !== "seller" && !req.user.admin) {
    throw new apiError(403, "Only sellers can view seller products");
  }

  const query = req.user.admin ? {} : { seller: req.user._id };
  const skip = (Number(page) - 1) * Number(limit);

  const products = await Product.find(query)
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalProducts = await Product.countDocuments(query);

  return res.status(200).json({
    success: true,
    message: "Seller products fetched successfully",
    page: Number(page),
    limit: Number(limit),
    totalProducts,
    totalPages: Math.ceil(totalProducts / Number(limit)),
    products,
  });
});

const getSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) throw new apiError(404, "Product not found");

  return res
    .status(200)
    .json({ status: 200, messsage: "Product found successfully", product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!req.user) {
    throw new apiError(401, "Login required to update product");
  }

  const product = await Product.findById(id);
  if (!product) throw new apiError(404, "Product not found");

  if (!isProductOwnerOrAdmin(product, req.user)) {
    throw new apiError(403, "You are not allowed to update this product");
  }

  const protectedFields = ["seller", "_id", "createdAt", "updatedAt"];
  protectedFields.forEach((field) => delete req.body[field]);

  const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  return res
    .status(200)
    .json({
      status: 200,
      message: "Product updated successfully",
      product: updatedProduct,
    });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!req.user) {
    throw new apiError(401, "Login required to delete product");
  }

  const product = await Product.findById(id);
  if (!product) throw new apiError(404, "Product not found");

  if (!isProductOwnerOrAdmin(product, req.user)) {
    throw new apiError(403, "You are not allowed to delete this product");
  }

  await Product.findByIdAndDelete(id);

  return res
    .status(200)
    .json({ status: 204, message: "Product deleted successfully", product });
});

module.exports = {
  createProduct,
  getAllProduct,
  getMyProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};

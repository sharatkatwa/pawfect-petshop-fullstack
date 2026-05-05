const Product = require("../models/product.model");

const createProduct = async (req, res) => {
  const {
    productName,
    seller,
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
  console.log("file request: ",req.files)
  console.log("BODY request: ",req.body)
  res.status(200).json({body:req.body,file:req.file})
  // if ((!seller, !description, !price, !productName))
  //   return res.status(400).json({
  //     status: 400,
  //     message: "Mandatory fields are required like productName, seller, description and price",
  //   });
  // const newProduct = await Product.create(req.body);
  // return res.status(201).json({ status: 201, message: "Product added successfully", newProduct });
};

const getAllProduct = async (req, res) => {
  const products = await Product.find();
  return res.status(200).json({ status: 200,total:products.length, message: "product fetched successfully", products });
};

const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  return res.status(200).json({ status: 200, messsage: "Product found successfully", product });
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, { returnDocument: "after" });
  return res.status(200).json({ status: 200, message: "Product updated successfully", product });
};
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  return res.status(200).json({ status: 204, message: "Product deleted successfully", product });
};

module.exports = { createProduct, getAllProduct, getSingleProduct, updateProduct, deleteProduct };

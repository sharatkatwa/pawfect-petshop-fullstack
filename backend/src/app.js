const express = require("express");
const dbConnect = require("./config/db");
const User = require("./models/user.model");
const cors = require("cors");

const app = express();

// router import
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");

app.use(cors());

dbConnect();

app.use(express.json());

app.use("/api/v1/product/", productRouter);
app.use("/api/v1/user/", userRouter);

module.exports = app;

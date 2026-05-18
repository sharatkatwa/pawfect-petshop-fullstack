const User = require("../models/user.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const apiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const ensureAdmin = (user) => {
  if (!user) {
    throw new apiError(401, "Login required");
  }

  if (!user.admin) {
    throw new apiError(403, "Admin access required");
  }
};

const getPagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.max(Number(query.limit) || 10, 1);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const getAdminStats = asyncHandler(async (req, res) => {
  ensureAdmin(req.user);

  const [
    totalUsers,
    activeUsers,
    totalCustomers,
    totalSellers,
    totalProducts,
    availableProducts,
    lowStockProducts,
    totalOrders,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    revenueResult,
    recentOrders,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    User.countDocuments({ role: "customer" }),
    User.countDocuments({ role: "seller" }),
    Product.countDocuments(),
    Product.countDocuments({ status: "available" }),
    Product.countDocuments({ stock: { $lte: 5 } }),
    Order.countDocuments(),
    Order.countDocuments({ status: "pending" }),
    Order.countDocuments({ status: "delivered" }),
    Order.countDocuments({ status: "cancelled" }),
    Order.aggregate([
      { $match: { status: "delivered" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]),
    Order.find()
      .populate("buyer", "name email")
      .populate("items.product", "productName price images")
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  return res.status(200).json({
    success: true,
    message: "Admin stats fetched successfully",
    stats: {
      users: {
        total: totalUsers,
        active: activeUsers,
        customers: totalCustomers,
        sellers: totalSellers,
      },
      products: {
        total: totalProducts,
        available: availableProducts,
        lowStock: lowStockProducts,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
      },
      revenue: revenueResult[0]?.totalRevenue || 0,
      recentOrders,
    },
  });
});

const getAdminUsers = asyncHandler(async (req, res) => {
  ensureAdmin(req.user);

  const { page, limit, skip } = getPagination(req.query);
  const { role, search, isActive } = req.query;
  const query = {};

  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === "true";
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const [users, totalUsers] = await Promise.all([
    User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(query),
  ]);

  return res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    page,
    limit,
    totalUsers,
    totalPages: Math.ceil(totalUsers / limit),
    users,
  });
});

const getAdminOrders = asyncHandler(async (req, res) => {
  ensureAdmin(req.user);

  const { page, limit, skip } = getPagination(req.query);
  const { status, search } = req.query;
  const query = {};

  if (status) query.status = status;

  const ordersQuery = Order.find(query)
    .populate("buyer", "name email phone")
    .populate("items.product", "productName price images seller")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const [orders, totalOrders] = await Promise.all([
    ordersQuery,
    Order.countDocuments(query),
  ]);

  const filteredOrders = search
    ? orders.filter((order) => {
        const buyer = order.buyer;
        const searchValue = search.toLowerCase();
        return (
          buyer?.name?.toLowerCase().includes(searchValue) ||
          buyer?.email?.toLowerCase().includes(searchValue) ||
          order._id.toString().includes(searchValue)
        );
      })
    : orders;

  return res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    page,
    limit,
    totalOrders,
    totalPages: Math.ceil(totalOrders / limit),
    orders: filteredOrders,
  });
});

const getAdminProducts = asyncHandler(async (req, res) => {
  ensureAdmin(req.user);

  const { page, limit, skip } = getPagination(req.query);
  const { category, status, search, lowStock } = req.query;
  const query = {};

  if (category) query.category = category;
  if (status) query.status = status;
  if (lowStock === "true") query.stock = { $lte: 5 };
  if (search) query.productName = { $regex: search, $options: "i" };

  const [products, totalProducts] = await Promise.all([
    Product.find(query)
      .populate("seller", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments(query),
  ]);

  return res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    page,
    limit,
    totalProducts,
    totalPages: Math.ceil(totalProducts / limit),
    products,
  });
});

module.exports = {
  getAdminStats,
  getAdminUsers,
  getAdminOrders,
  getAdminProducts,
};

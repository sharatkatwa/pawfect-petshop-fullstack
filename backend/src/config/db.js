const mongoose = require("mongoose");
const dns = require('dns')

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");
const dbConnect = async () => {
  try {
    await mongoose.connect("mongodb+srv://sharat-admin:xlMiHgBxrXLYYYoE@cluster0.apbngjr.mongodb.net/pawfect");
    console.log("mongodb connected");
  } catch (error) {
    console.log("error:", error);
  }
};

module.exports = dbConnect;

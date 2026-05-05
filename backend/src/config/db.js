const mongoose = require("mongoose");
const dns = require('dns')

require('dotenv').config()

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongodb connected");
  } catch (error) {
    console.log("error:", error);
  }
};

module.exports = dbConnect;

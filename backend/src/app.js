const express = require("express");
const dbConnect = require("./config/db");
const User = require("./models/user.model");
const app = express();
dbConnect();
app.use(express.json());
const users = [];

app.get("/allUsers", async (req, res) => {
  const AllUsers = await User.find();
  return res.status(200).json({ status: 200, message: "data fetched successfully", AllUsers });
});
app.post("/addUser", async (req, res) => {
  users.push(req.body);
  const { name, age } = req.body;
  await User.create({ name, age });
  return res.status(201).json({ status: 201, message: "User created successfully", data: { name, age } });
});

app.patch("/updateUser/:id", async (req, res) => {
  const { id } = req.params;
  const { age } = req.body;
  const updatedUser = await User.findByIdAndUpdate(id, { age: age }, { returnDocument: "after" });

  //   users[index].age = 99;
  return res.status(200).json({ status: 200, message: "User updated successfully", data: updatedUser });
});

app.delete("/deleteUser/:id", async (req, res) => {
  const { id } = req.params;
  const deletedUser = await User.findByIdAndDelete(id);
  return res.status(200).json({ status: 204, message: "User deleted successfully", deletedUser });
});

module.exports = app;

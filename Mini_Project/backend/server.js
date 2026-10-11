

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET = "spendsmart_secret_key";

mongoose.connect("mongodb://127.0.0.1:27017/spendsmart")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// User details
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  budget: {
    type: Number,
    default: 5000
  }
});

const User = mongoose.model("User", userSchema);

// Expense details
const expenseSchema = new mongoose.Schema({
  userId: String,
  amount: Number,
  category: String,
  date: String,
  description: String
});

const Expense = mongoose.model("Expense", expenseSchema);

app.get("/", (req, res) => {
  res.send("SpendSmart Backend");
});

// Register
app.post("/register", async (req, res) => {
  try {
    const oldUser = await User.findOne({ email: req.body.email });

    if (oldUser) {
      return res.json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!match) {
      return res.json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, SECRET);

    res.json({
      message: "Login successful",
      token: token,
      name: user.name
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

// Check login token
function checkLogin(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, SECRET);

    req.userId = data.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Please login first" });
  }
}

// View and search expenses
app.get("/expenses", checkLogin, async (req, res) => {
  try {
    const search = req.query.search || "";

    const expenses = await Expense.find({
      userId: req.userId,
      description: { $regex: search, $options: "i" }
    });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching expenses" });
  }
});

// Add expense
app.post("/expenses", checkLogin, async (req, res) => {
  try {
    const expense = new Expense({
      userId: req.userId,
      amount: req.body.amount,
      category: req.body.category,
      date: req.body.date,
      description: req.body.description
    });

    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: "Error adding expense" });
  }
});

// Delete expense
app.delete("/expenses/:id", checkLogin, async (req, res) => {
  try {
    await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting expense" });
  }
});

// Get budget
app.get("/budget", checkLogin, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({ budget: user.budget });
});

// Update budget
app.put("/budget", checkLogin, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.userId,
    { budget: req.body.budget },
    { new: true }
  );

  res.json({ budget: user.budget });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

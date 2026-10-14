
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/spendsmart")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// User Model
const User = mongoose.model("User", {
  name: String,
  email: { type: String, unique: true },
  password: String
});

// Expense Model
const Expense = mongoose.model("Expense", {
  userId: String,
  amount: Number,
  category: String,
  date: String,
  description: String
});

// Register API
app.post("/register", async (req, res) => {
  try {
    await User.create(req.body);
    res.json({ message: "Registration successful" });
  } catch (err) {
    res.status(400).json({ message: "Email already exists" });
  }
});

// Login API
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    res.json({
      id: user._id,
      name: user.name
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

// READ - Display expenses
app.get("/expenses/:userId", async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.params.userId,
      description: {
        $regex: req.query.search || "",
        $options: "i"
      }
    });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Could not load expenses" });
  }
});

// CREATE - Add expense
app.post("/expenses", async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: "Could not add expense" });
  }
});

// UPDATE - Edit expense
app.put("/expenses/:id", async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.body.userId },
      {
        amount: req.body.amount,
        category: req.body.category,
        date: req.body.date,
        description: req.body.description
      },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: "Could not update expense" });
  }
});

// DELETE - Remove expense
app.delete("/expenses/:id", async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.query.userId
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: "Could not delete expense" });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

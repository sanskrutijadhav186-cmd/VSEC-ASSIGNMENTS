
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const SECRET = "spendsmart_secret_key";

app.use(cors());
app.use(express.json());

// Connect to database
mongoose.connect("mongodb://127.0.0.1:27017/spendsmart")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// User model
const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
}));

// Expense model
const Expense = mongoose.model("Expense", new mongoose.Schema({
  userId: String,
  amount: Number,
  category: String,
  date: String,
  description: String
}));

// Login
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, SECRET);

    res.json({ token, name: user.name });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

// Check login
function auth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, SECRET);
    req.userId = data.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Please login first" });
  }
}

// READ expenses
app.get("/expenses", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.userId,
      description: { $regex: req.query.search || "", $options: "i" }
    });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Could not load expenses" });
  }
});

// CREATE expense
app.post("/expenses", auth, async (req, res) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      userId: req.userId
    });

    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: "Could not add expense" });
  }
});

// UPDATE expense
app.put("/expenses/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
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

// DELETE expense
app.delete("/expenses/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: "Could not delete expense" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

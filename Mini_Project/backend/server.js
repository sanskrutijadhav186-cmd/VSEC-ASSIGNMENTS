

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/campus_lost_found")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const itemSchema = new mongoose.Schema({
  name: String,
  type: String,
  location: String,
  status: {
    type: String,
    default: "Available"
  }
});

const Item = mongoose.model("Item", itemSchema);

app.get("/", (req, res) => {
  res.send("Campus Lost & Found Portal Backend");
});

// Get all items and search by name
app.get("/items", async (req, res) => {
  try {
    const search = req.query.search || "";

    const items = await Item.find({
      name: { $regex: search, $options: "i" }
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching items" });
  }
});

// Add an item
app.post("/items", async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Error adding item" });
  }
});

// Update item status
app.put("/items/:id", async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Error updating item" });
  }
});

// Delete an item
app.delete("/items/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting item" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

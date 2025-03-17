const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

// MongoDB Schema
const authorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const Author = mongoose.model("Author", authorSchema);

// Middleware for authentication
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied, no token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Create Author (POST)
router.post("/authorcreate", authenticate, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }

    const newAuthor = new Author({ userId: req.userId, name, description });
    await newAuthor.save();
    res.status(201).json({ message: "Author created successfully", newAuthor });
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get All Authors (GET)
router.get("/getauthors", authenticate, async (req, res) => {
  try {
    const authors = await Author.find({ userId: req.userId });
    res.status(200).json(authors);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Single Author (GET)
router.get("/getauthor/:id", authenticate, async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ message: "Author not found" });

    res.status(200).json(author);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update Author (PUT)
router.put("/updateauthor/:id", authenticate, async (req, res) => {
  try {
    const { name, description } = req.body;
    const author = await Author.findById(req.params.id);

    if (!author) return res.status(404).json({ message: "Author not found" });
    if (author.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    author.name = name || author.name;
    author.description = description || author.description;
    await author.save();

    res.status(200).json({ message: "Author updated successfully", author });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete Author (DELETE)
router.delete("/deleteauthor/:id", authenticate, async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);

    if (!author) return res.status(404).json({ message: "Author not found" });
    if (author.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    await Author.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Author deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

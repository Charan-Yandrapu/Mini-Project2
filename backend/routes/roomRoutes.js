const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

// CREATE
router.post("/", async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// GET ALL
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;
// GET Single Room By ID
router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found"
      });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
// UPDATE Room
router.put("/:id", async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!room) {
      return res.status(404).json({
        message: "Room not found"
      });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
// DELETE Room
router.delete("/:id", async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found"
      });
    }

    res.json({
      message: "Room deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
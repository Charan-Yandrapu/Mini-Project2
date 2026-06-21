const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const Room = require("../models/Room");

// CREATE Booking
router.post("/", async (req, res) => {
  try {
    // Check if room exists
    const room = await Room.findOne({
      roomNumber: req.body.roomNumber,
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    // Check if room is already booked
    if (room.status === "Booked") {
      return res.status(400).json({
        message: "Room is already booked",
      });
    }

    // Create booking
    const booking = await Booking.create(req.body);

    // Update room status
    room.status = "Booked";
    await room.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET All Bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET Booking By ID
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// UPDATE Booking
router.put("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE Booking
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Make room available again
    await Room.findOneAndUpdate(
      { roomNumber: booking.roomNumber },
      { status: "Available" }
    );

    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
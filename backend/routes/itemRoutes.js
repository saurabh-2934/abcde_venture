const express = require("express");
const Item = require("../models/Item");
const authorize = require("../middleware/check_auth");

const router = express.Router();

//for my personal use
router.post("/add", authorize, async (req, res) => {
  try {
    const { itemArray } = req.body;

    if (itemArray.length === 0) {
      return res.status(400).json({ error_msg: "all fields are required!!!" });
    }

    await Item.insertMany(itemArray);
    res.status(201).json({ message: "Items are inserted!" });
  } catch (err) {
    res.status(500).json({ error_msg: err.message });
  }
});

//@router GET /api/items
router.get("/items", authorize, async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json({ items });
  } catch (err) {
    res.status(500).json({ error_msg: err.message });
  }
});

module.exports = router;

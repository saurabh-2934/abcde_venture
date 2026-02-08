const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authorize = require("../middleware/check_auth");

// @route   POST api/users
router.post("/users", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const newUser = new User({
      username,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    await newUser.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error_msg: e.message });
  }
});

//@route GET api/users
router.get("/users", authorize, async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({ allUsers });
  } catch (err) {
    res.status(500).json({ error_msg: e.message });
  }
});

//@router POST api/users/login
router.post("/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(403).json({ error_msg: "all feilds are required!" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error_msg: "Invalid username/password" });
    }

    if (user.token) {
      return res
        .status(403)
        .json({ error_msg: "User is already logged in on another device" });
    }

    const mathcedPassword = await bcrypt.compare(password, user.password);

    if (!mathcedPassword) {
      return res.status(400).json({ error_msg: "Invalid username/password" });
    }

    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, process.env.MY_SECRET_TOKEN, {
      expiresIn: "1d",
    });
    user.token = token;
    await user.save();

    res.header("Authorization", token).send({ token });
  } catch (err) {
    res.status(500).json({ error_msg: err.message });
  }
});

//@router POST /api/users/logout
router.post("/users/logout", authorize, async (req, res) => {
  try {
    const { id } = req;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error_msg: "User not found" });
    }

    if (!user.token) {
      return res.status(401).json({ error_msg: "User already logged out" });
    }

    user.token = null;
    await user.save();

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error_msg: err.message });
  }
});

module.exports = router;

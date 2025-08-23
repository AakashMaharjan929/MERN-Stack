const express = require('express');
const router = express.Router();
const multer =  require("multer");
const User = require('../models/User');


const fs = require('fs').promises;
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });


router.post("/", upload.single('image'), async (req, res) => {
    const { username, email, password } = req.body;
    const image = req.file.filename;

    const newUser = new User({
        username,
        email,
        password,
        image
    });

    try {
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

router.put("/:id", upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (req.file && user.image) {
      const oldImagePath = path.join(__dirname, '..', 'uploads', user.image);

      try {
        await fs.unlink(oldImagePath);
        console.log("Old image deleted:", oldImagePath);
      } catch (err) {
        console.error("Failed to delete old image:", err);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, {
      username,
      email,
      password,
      image: req.file ? req.file.filename : user.image
    }, { new: true });

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.image) {
     const imagePath = path.join(__dirname, '..', 'uploads', user.image);
      try {
        await fs.unlink(imagePath);
        console.log("Image deleted:", imagePath);
      } catch (err) {
        console.error("Failed to delete image:", err);
      }
    }

    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



module.exports = router;

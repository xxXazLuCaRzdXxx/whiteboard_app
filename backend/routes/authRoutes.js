const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { username, password, isadmin } = req.body;
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ username, password, isadmin });
    await user.save();
    res.status(201).json({ message: 'User created successfully'});
  } catch (error) {
    res.status(500).json({ message: 'Error creating the user', error: error.message });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    // Check if the user is an admin
    if (user.isadmin) {
      // You can customize this response based on your needs
      return res.status(200).json({ message: 'Admin signed in successfully' , isadmin: user.isadmin});
    }
    res.status(200).json({ message: 'User signed in successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error signing in', error: error.message });
  }
});

module.exports = router;
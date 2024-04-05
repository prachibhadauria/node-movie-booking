const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  let user = await User.findOne({ username });
  if (user) return res.status(400).send('User already exists.');

  const salt = await bcrypt.genSalt(10);
  user = new User({
    username,
    password: await bcrypt.hash(password, salt),
    role: 'user'
  });

  await user.save();
  const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.header('Authorization', token).send({ username: user.username, role: user.role });
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  let user = await User.findOne({ username });
  if (!user) return res.status(400).send('Invalid username or password.');

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('Invalid username or password.');

  const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.send({ username: user.username, role: user.role, token });
});

module.exports = router;
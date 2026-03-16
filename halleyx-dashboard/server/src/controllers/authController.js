const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret_halleyx_key_1234', {
    expiresIn: '30d',
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        phoneNumber: user.phoneNumber,
        location: user.location,
        jobTitle: user.jobTitle,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio ?? user.bio;
      user.phoneNumber = req.body.phoneNumber ?? user.phoneNumber;
      user.location = req.body.location ?? user.location;
      user.jobTitle = req.body.jobTitle ?? user.jobTitle;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        phoneNumber: updatedUser.phoneNumber,
        location: updatedUser.location,
        jobTitle: updatedUser.jobTitle,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    console.log('Received avatar upload request');
    if (!req.file) {
      console.log('No file received in request');
      return res.status(400).json({ message: 'Please upload an image' });
    }

    console.log('File details:', {
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    const user = await User.findById(req.user._id);

    if (user) {
      console.log(`Updating avatar for user: ${user.email}`);
      // Assuming multer is configured to save to 'uploads/'
      user.avatar = `/uploads/${req.file.filename}`;
      await user.save();
      console.log('Avatar saved successfully to DB');
      res.json({ avatar: user.avatar });
    } else {
      console.log('User not found for ID:', req.user._id);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in uploadAvatar:', error);
    res.status(500).json({ message: error.message });
  }
};

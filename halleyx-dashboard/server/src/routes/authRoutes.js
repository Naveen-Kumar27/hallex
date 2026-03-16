const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { registerUser, loginUser, getMe, updateProfile, uploadAvatar } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const filename = `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`;
    console.log('Generating filename for upload:', filename);
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1000000 }, // 1MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  },
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;

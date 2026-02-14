const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', [verifyToken, upload.single('file')], mediaController.uploadMedia);
router.get('/my', verifyToken, mediaController.getMyMedia);
router.get('/user/:userId', [verifyToken, isAdmin], mediaController.getUserMedia);
router.delete('/:id', verifyToken, mediaController.deleteMedia);

module.exports = router;

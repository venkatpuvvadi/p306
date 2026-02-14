const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

router.get('/', [verifyToken, isAdmin], userController.getAllUsers);
router.get('/:id', [verifyToken, isAdmin], userController.getUserById);
// Allow file upload for profile photo
router.post('/', [verifyToken, isAdmin, upload.single('profile_photo')], userController.createUser);
router.put('/:id', [verifyToken, isAdmin, upload.single('profile_photo')], userController.updateUser);
router.delete('/:id', [verifyToken, isAdmin], userController.deleteUser);

module.exports = router;

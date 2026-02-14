const db = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.uploadMedia = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

    const { filename, path: filePath, mimetype, size } = req.file;
    const userId = req.userId;

    try {
        const [result] = await db.execute(
            'INSERT INTO media (file_name, file_path, file_type, file_size, uploaded_by, is_deleted) VALUES (?, ?, ?, ?, ?, ?)',
            [filename, filePath, mimetype, size, userId, false]
        );
        res.status(201).json({ message: 'File uploaded successfully', mediaId: result.insertId, file: req.file });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMyMedia = async (req, res) => {
    try {
        // Only show non-deleted media to the user
        const [files] = await db.execute('SELECT * FROM media WHERE uploaded_by = ? AND is_deleted = 0', [req.userId]);
        res.status(200).json(files);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserMedia = async (req, res) => {
    const userId = req.params.userId;
    try {
        // Admin sees all media, deleted ones will have is_deleted = 1
        const [files] = await db.execute('SELECT * FROM media WHERE uploaded_by = ?', [userId]);
        res.status(200).json(files);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteMedia = async (req, res) => {
    const mediaId = req.params.id;
    try {
        const [media] = await db.execute('SELECT * FROM media WHERE id = ?', [mediaId]);
        if (media.length === 0) return res.status(404).json({ message: 'Media not found.' });

        const mediaItem = media[0];

        // Check verification
        if (req.userRole !== 'admin' && mediaItem.uploaded_by !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized.' });
        }

        if (req.userRole === 'admin') {
            // Admin: Hard Delete
            if (fs.existsSync(mediaItem.file_path)) {
                fs.unlinkSync(mediaItem.file_path);
            }
            await db.execute('DELETE FROM media WHERE id = ?', [mediaId]);
            res.status(200).json({ message: 'Media permanently deleted.' });
        } else {
            // User: Soft Delete
            await db.execute('UPDATE media SET is_deleted = 1 WHERE id = ?', [mediaId]);
            res.status(200).json({ message: 'Media deleted.' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

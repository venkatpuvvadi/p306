const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, username, role, profile_photo, is_active, created_at FROM users');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, username, role, profile_photo, is_active, created_at FROM users WHERE id = ?', [req.params.id]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found.' });
        res.status(200).json(users[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createUser = async (req, res) => {
    const { username, password, role } = req.body;
    let profilePhotoPath = null;

    if (req.file) {
        profilePhotoPath = req.file.path;
    }

    try {
        const passwordHash = bcrypt.hashSync(password, 8);
        const [result] = await db.execute(
            'INSERT INTO users (username, password_hash, role, profile_photo, is_active) VALUES (?, ?, ?, ?, ?)',
            [username, passwordHash, role || 'user', profilePhotoPath, true]
        );
        res.status(201).json({ message: 'User created successfully.', userId: result.insertId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    let { username, role, password, is_active } = req.body;

    // Parse is_active if it's a string (from FormData)
    if (is_active === 'true' || is_active === '1') is_active = 1;
    else if (is_active === 'false' || is_active === '0') is_active = 0;
    let query = 'UPDATE users SET username = ?, role = ?, is_active = ?';
    let params = [username, role, is_active];

    if (req.file) {
        query += ', profile_photo = ?';
        params.push(req.file.path);
    }

    if (password) {
        const passwordHash = bcrypt.hashSync(password, 8);
        query += ', password_hash = ?';
        params.push(passwordHash);
    }

    query += ' WHERE id = ?';
    params.push(userId);

    try {
        await db.execute(query, params);
        res.status(200).json({ message: 'User updated successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        // Soft Delete: Set is_active to false
        await db.execute('UPDATE users SET is_active = 0 WHERE id = ?', [userId]);
        res.status(200).json({ message: 'User deactivated successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

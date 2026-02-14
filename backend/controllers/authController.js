const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const dotenv = require('dotenv');

dotenv.config();

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        const user = users[0];

        if (!user) return res.status(404).json({ message: 'User not found.' });

        const passwordIsValid = bcrypt.compareSync(password, user.password_hash);
        if (!passwordIsValid) return res.status(401).json({ message: 'Invalid Password!' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).send({
            id: user.id,
            username: user.username,
            role: user.role,
            profile_photo: user.profile_photo,
            accessToken: token
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.logout = (req, res) => {
    res.status(200).send({ message: "Logged out successfully." });
};

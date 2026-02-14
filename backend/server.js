const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes (to be imported)
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/media', mediaRoutes);

// Serve Frontend Build if valid path is provided
if (process.env.FRONTEND_BUILD_PATH) {
    const frontendPath = path.resolve(__dirname, process.env.FRONTEND_BUILD_PATH);
    console.log(`Serving frontend from: ${frontendPath}`);
    app.use(express.static(frontendPath));
    // Use regex for catch-all in Express 5 if * fails
    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('Media Portal API is running...');
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Make sure you have this file for DB connection
const authRoutes = require('./routes/authRoutes');
const authorRoutes = require('./routes/authorRoutes'); // Import correct file for author routes

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/author', authorRoutes); // Ensure this is correct

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

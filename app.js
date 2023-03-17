const express = require('express');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/dbConfig');
const config = require('config');
const auth = require('./middleware/authMiddleware');

connectDB();

const app = express();
app.use(express.json());
app.use('/api/tasks', auth, taskRoutes);
app.use('/api/users', userRoutes);

const PORT = config.get('PORT');
app.listen(PORT, (error) => {
    if (error) {
        console.error('Failed to start server:', error);
    } else {
        console.log(`Server running on port ${PORT} in ${config.get('NODE_ENV')} mode`);
    }
});

const express = require('express');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/dbConfig');
const config = require('config');
const auth = require('./middleware/authMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

// TODO: Research about calling async methods like fire and forget. To Avoid `Promise returned from connectDB is ignored` warning
connectDB();

const app = express();
app.use(express.json());
app.use('/api/tasks', auth, taskRoutes);
app.use('/api/users', userRoutes);
app.use(errorMiddleware);

// TODO: Investigate this more
process.on('unhandledRejection', error => {
    console.log("This is unhandledRejection " + error);
})

// TODO: Here we may need to restart the server in the production environment. Currently we will just kill the process.
process.on('uncaughtException', error => {
    console.log("uncaughtException listener event: " + error);
    process.exit(1);
})

const PORT = config.get('PORT');
app.listen(PORT, (error) => {
    if (error) {
        console.error('Failed to start server:', error);
    } else {
        console.log(`Server running on port ${PORT} in ${config.get('NODE_ENV')} mode`);
    }
});

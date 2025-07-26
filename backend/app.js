// backend/app.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// import userRoutes from './routes/userRoutes.js';
// import roadmapRoutes from './routes/roadmapRoutes.js';
// import logRoutes from './routes/logRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
// app.use('/api/users', userRoutes);
// app.use('/api/roadmaps', roadmapRoutes);
// app.use('/api/logs', logRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('MirrorLog Backend API is running 🚀');
});

export default app;

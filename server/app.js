require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { authenticateToken } = require('./middleware/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes);

app.get('/', (req, res) => {
  res.send('API running');
});
const corsOptions = {
  origin: ['https://mern-personal-task-manager-4.onrender.com'], // frontend deployed URL
  credentials: true,
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 5700;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

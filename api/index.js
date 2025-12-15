const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const userRouter = require('./routes/userRoute');
const customerRouter = require('./routes/customerRoute');
const zoneRouter = require('./routes/zoneRoute');
const areaRouter = require('./routes/areaRoute');
const houseRouter = require('./routes/houseRoute');
const electricRouter = require('./routes/electricRoute');
const invoiceRouter = require('./routes/invoiceRoute');

const app = express();

// Middlewares
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Only one CORS setup with frontend URL
app.use(cors({
  origin: 'https://bahdo-electricity-system-frontend.vercel.app',
  credentials: true
}));

// MongoDB connection
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
}

// Routes
app.use('/api/user', userRouter);
app.use('/api/customer', customerRouter);
app.use('/api/zone', zoneRouter);
app.use('/api/area', areaRouter);
app.use('/api/house', houseRouter);
app.use('/api/electric', electricRouter);
app.use('/api/invoice', invoiceRouter);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Vercel Server!' });
});

// Export app for Vercel
module.exports = app;

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const userRouter = require('../routes/userRout');
const customerRouter = require('../routes/customerRoute');
const zoneRouter = require('../routes/zoneRoute');
const areaRouter = require('../routes/areaRoute');
const houseRouter = require('../routes/houseRoute');
const electricRouter = require('../routes/electricRoute');
const invoiceRouter = require('../routes/invoiceRoute');

const app = express();
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI)
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

// Root
app.get('/', (req, res) => res.json({ message: 'Hello from Vercel Server!' }));

module.exports = app;  // ✅ Important: NO app.listen()

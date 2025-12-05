const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRout');
const customerRouter = require('./routes/customerRoute'); // Import the student router
const zoneRouter = require('./routes/zoneRoute');
const areaRouter = require('./routes/areaRoute');
const houseRouter = require('./routes/houseRoute');
// const invoiceRouter = require('./routes/invoiceRoute');
// const paymentRouter = require('./routes/paymentRoute');
require('dotenv').config();
const app = express();
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Failed to connect to MongoDB', err);   
});


app.use('/api/user', userRouter);
app.use('/api/customer', customerRouter); 
app.use('/api/zone', zoneRouter);
app.use('/api/area', areaRouter);
app.use('/api/house', houseRouter);
// app.use('/api/invoice', invoiceRouter);
// app.use('/api/payment', paymentRouter);

// Root endpoint
app.get('/', (req, res) => {
    res.send({message:'Hello From The server!'});
});

// Start the server
const port = process.env.PORT || 7001;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
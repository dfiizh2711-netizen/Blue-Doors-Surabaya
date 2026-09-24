import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRoutes from './routes/products.js';
import bookingsRoutes from './routes/bookings.js';
import ordersRoutes from './routes/orders.js';
import paymentRoutes from './routes/payment.js';
import usersRoutes from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & JSON Parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'Blue Doors Surabaya Backend Service',
    midtrans: 'Connected',
    merchantId: process.env.MIDTRANS_MERCHANT_ID || 'M294142139',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/products', productsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/users', usersRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`☕ Blue Doors Surabaya Backend API Running on Port ${PORT}`);
  console.log(`💳 Midtrans Merchant ID: ${process.env.MIDTRANS_MERCHANT_ID || 'M294142139'}`);
  console.log(`=======================================================`);
});

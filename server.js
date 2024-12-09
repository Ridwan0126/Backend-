require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth/authRoutes');
const userRoutes = require('./routes/user/userRoutes');
const pointExchangeRoutes = require('./routes/kuypoint/pointExchangeRoutes');
const yukBuangRoutes = require('./routes/yukbuang/yukBuangRoutes');
const yukAngkutRoutes = require('./routes/yukangkut/yukAngkutRoutes');
const dashboardRoutes = require('./routes/dashboard/dashboardRoutes');
const messageRoutes = require('./routes/message/messageRoutes');
const notificationRoutes = require('./routes/notification/notifRoutes');
const db = require('./config/db');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads/profile_pictures', express.static(path.join(__dirname, 'uploads/profile_pictures')));
app.use('/uploads/receipts', express.static(path.join(__dirname, 'uploads/receipts')));

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes); 
app.use('/api/point-exchange', pointExchangeRoutes);
app.use('/api/yuk_buang', yukBuangRoutes);
app.use('/api/yuk_angkut', yukAngkutRoutes);
app.use('/api/message', messageRoutes);
app.use('/api', notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
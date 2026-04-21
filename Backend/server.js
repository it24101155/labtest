const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
require('dotenv').config();

dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();
app.use(cors());
app.use(express.json());
mongoose.set('bufferCommands', false);
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.log('MongoDB connection failed:', err.message));
const itemRoutes = require('./routes/items');
app.use('/api/items', itemRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port 
${PORT}`));
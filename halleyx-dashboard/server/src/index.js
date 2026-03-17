require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');
const AIDashboardService = require('./services/AIDashboardService');

const http = require('http');
const { Server } = require('socket.io');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust for production
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// TOP LEVEL DIAGNOSTIC (Before any other middleware or routes)
app.get('/diag-now', (req, res) => {
  res.json({
    status: 'online',
    deploymentId: 'DEBUG_403_V1',
    hasKey: !!process.env.GEMINI_API_KEY,
    keyPrefix: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 8) + '...' : 'none'
  });
});
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Socket.io connection
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Make io accessible to routes
app.set('io', io);

// Simple root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the Halleyx Dashboard API', 
    status: 'stable',
    deployId: 'DEBUG_403_V1'
  });
});

app.get('/final-diag', (req, res) => {
  res.json({
    status: 'ok',
    hasKey: !!process.env.GEMINI_API_KEY,
    keyPrefix: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 8) + '...' : 'none',
    timestamp: new Date().toISOString(),
    node_env: process.env.NODE_ENV
  });
});

// Import Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/dashboards', require('./routes/dashboardRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
// app.use('/api/widgets', require('./routes/widgetRoutes'));

app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Global Error Caught:", err.message);
  console.error(err.stack);
  res.header('X-Debug-Source', 'Global-Error-Handler');
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: err.message,
    deployId: 'DEBUG_403_V4'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful error handler — prevents unhandled 'error' event crashes
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use.`);
    console.error(`   Run: Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force`);
    console.error(`   Then restart: npm run dev\n`);
    process.exit(1);
  } else {
    throw err;
  }
});

module.exports = app;

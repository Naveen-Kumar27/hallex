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
  res.json({ message: 'Welcome to the Halleyx Dashboard API', version: '1.0.1 (debug-model-fix)', timestamp: new Date().toISOString() });
});

// Import Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/dashboards', require('./routes/dashboardRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
// app.use('/api/widgets', require('./routes/widgetRoutes'));

// Debug Environment (Remove in production)
app.get('/api/analytics/debug-env', (req, res) => {
  const key = process.env.GEMINI_API_KEY;
  res.json({
    hasKey: !!key,
    keyLength: key ? key.length : 0,
    keyPrefix: key ? key.substring(0, 8) + '...' : 'none',
    nodeEnv: process.env.NODE_ENV,
    version: '1.0.2'
  });
});

// AI Analyze Requirement (Directly in index.js for debugging Render issue)
app.post('/api/analytics/ai-analyze', async (req, res) => {
  try {
    console.log("--- AI ANALYZE REQUEST ---");
    console.log("Request body:", JSON.stringify(req.body));
    const { prompt, history } = req.body;
    
    if (!prompt) {
      console.warn("Missing prompt in request");
      return res.status(400).json({ message: "Prompt is required" });
    }

    console.log("Calling AIDashboardService.analyzeRequirement...");
    const analysis = await AIDashboardService.analyzeRequirement(prompt, history);
    console.log("Analysis successful");
    res.json(analysis);
  } catch (error) {
    console.error("!!! AI ANALYZE FAILED !!!");
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    
    // Check for specific Gemini errors
    const errorMessage = error.message || 'Unknown error';
    const statusCode = errorMessage.includes('403') || errorMessage.includes('PERMISSION_DENIED') ? 403 : 500;
    
    res.status(statusCode).json({ 
      error: errorMessage,
      details: error.stack?.split('\n').slice(0, 3).join(' ') 
    });
  }
});

app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
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

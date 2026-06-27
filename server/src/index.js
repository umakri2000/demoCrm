var express = require('express');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var { config } = require('./config/config');
var { ensureDatabase } = require('./config/ensureDatabase');
var { initDB } = require('./config/db');
var authRoutes = require('./routes/auth.routes');
var customerRoutes = require('./routes/customer.routes');
var dashboardRoutes = require('./routes/dashboard.routes');
var { userService } = require('./services/user.service');

var app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Bind routes
app.use('/api/auth', authRoutes);
app.use('/api/customersdata', customerRoutes); // handles public POST
app.use('/api/customers', customerRoutes); // handles protected GET and PUT
app.use('/api/dashboard', dashboardRoutes);


// Initialize server
var startServer = async () => {
  try {
    await ensureDatabase();
    await initDB();
    await userService.initializeSeedUser();
    app.listen(config.port, () => {
      console.log(`=========================================`);
      console.log(`  CRM Backend Server running on port ${config.port}`);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('[Startup] Fatal error during server initialization:', error.message);
    process.exit(1);
  }
};

startServer();

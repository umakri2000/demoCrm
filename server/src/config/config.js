var dotenv = require('dotenv');
var path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

var config = {
  port: parseInt(process.env.PORT || '5000', 10),
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret',
  refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: parseInt(process.env.DB_PORT || '5432', 10),
  dbUser: process.env.DB_USER || 'postgres',
  dbPassword: process.env.DB_PASSWORD || 'postgres',
  dbName: process.env.DB_NAME || 'democrm'
};

module.exports = { config };

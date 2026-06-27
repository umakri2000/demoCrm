var jwt = require('jsonwebtoken');
var { config } = require('../config/config');
var { userService } = require('../services/user.service');

var authMiddleware = async (req, res, next) => {
  try {
    var authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized: No token provided' });
      return;
    }

    var token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (err) {
      res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
      return;
    }

    var userId = decoded.sub;
    var user = await userService.findById(userId);
    if (!user) {
      res.status(401).json({ message: 'Unauthorized: User not found' });
      return;
    }

    req.user = userService.toSafeUser(user);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Authentication failed' });
  }
};

module.exports = { authMiddleware };

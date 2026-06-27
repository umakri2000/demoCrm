var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var { config } = require('../config/config');
var { userService } = require('./user.service');

var authService = {
  async login(email, passwordPlain) {
    var user = await userService.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    var isMatch = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    var safeUser = userService.toSafeUser(user);

    var tokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    var accessToken = jwt.sign(tokenPayload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    var refreshToken = jwt.sign({ sub: user.id }, config.refreshSecret, {
      expiresIn: config.refreshExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  },

  async refreshToken(token) {
    try {
      var decoded = jwt.verify(token, config.refreshSecret);
      var user = await userService.findById(decoded.sub);
      if (!user) {
        throw new Error('Invalid refresh token');
      }

      var tokenPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      var newAccessToken = jwt.sign(tokenPayload, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
      });

      return newAccessToken;
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  },

  async register(email, name, passwordPlain) {
    return userService.createUser(email, name, passwordPlain);
  }
};

module.exports = { authService };

var { authService } = require('../services/auth.service');

var authController = {
  async register(req, res) {
    try {
      console.log("I get the register route")
      var { email, name, password } = req.body;
      if (!email || !name || !password) {
        return res.status(400).json({ message: 'Email, name, and password are required' });
      }

      var user = await authService.register(email, name, password);
      var { accessToken, refreshToken } = await authService.login(email, password);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(201).json({ message: 'User registered successfully', user, accessToken });
    } catch (error) {
      var message = error.message || 'Something went wrong';
      res.status(400).json({ message });
    }
  },

  async login(req, res) {
    try {
      var { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }

      var { accessToken, refreshToken, user } = await authService.login(email, password);

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(200).json({ accessToken, user });
    } catch (error) {
      var message = error.message || 'Something went wrong';
      var statusCode = message === 'Invalid email or password' ? 401 : 400;
      res.status(statusCode).json({ message });
    }
  },

  async refresh(req, res) {
    try {
      var refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
      }

      var accessToken = await authService.refreshToken(refreshToken);
      res.status(200).json({ accessToken });
    } catch (error) {
      res.status(401).json({ message: 'Invalid refresh token' });
    }
  },

  async logout(req, res) {
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
  },

  async me(req, res) {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized: No user session found' });
        return;
      }
      res.status(200).json({ user: req.user });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = { authController };

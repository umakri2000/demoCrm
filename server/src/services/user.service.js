var bcrypt = require('bcryptjs');
var { userModel } = require('../models/user.model');

var userService = {
  async findByEmail(email) {
    return userModel.findByEmail(email);
  },

  async findById(id) {
    return userModel.findById(id);
  },

  async createUser(email, name, passwordPlain, role = 'admin') {
    var existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    var salt = await bcrypt.genSalt(10);
    var passwordHash = await bcrypt.hash(passwordPlain, salt);

    var newUser = await userModel.createUser(email, name, passwordHash, role);

    return this.toSafeUser(newUser);
  },

  toSafeUser(user) {
    if (!user) return null;
    var { passwordHash, ...safeUser } = user;
    return safeUser;
  },

  async initializeSeedUser() {
    var defaultEmail = 'admin@example.com';
    try {
      var existing = await this.findByEmail(defaultEmail);
      if (!existing) {
        console.log('Seeding database with default user...');
        var created = await this.createUser(defaultEmail, 'Admin User', 'password123', 'admin');
        console.log(`Seed user created: ${created.email} with password: password123`);
      }
    } catch (err) {
      console.error('Error seeding user:', err);
    }
  }
};

module.exports = { userService };

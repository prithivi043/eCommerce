// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { type: String, enum: ['admin', 'customer'], default: 'customer' }
});

const User = mongoose.model('User', userSchema);
module.exports = User;

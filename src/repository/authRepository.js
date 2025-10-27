const User = require('../model');

class AuthRepository {
  async findAll() {
    return await User.find().select('-password').sort({ createdAt: -1 });
  }

  async findById(id) {
    return await User.findById(id).select('-password');
  }

  async findByEmail(email) {
    return await User.findOne({ email: email.toLowerCase() });
  }

  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async update(id, userData) {
    return await User.findByIdAndUpdate(id, userData, { 
      new: true, 
      runValidators: true 
    }).select('-password');
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }
}

module.exports = new AuthRepository();
const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  autoCloseEnabled: { type: Boolean, default: true },
  confidenceThreshold: { type: Number, min: 0, max: 1, default: 0.78 },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now }
});

configSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Config', configSchema);

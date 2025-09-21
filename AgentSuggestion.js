const mongoose = require('mongoose');

const agentSuggestionSchema = new mongoose.Schema({
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  prompt: { type: String, required: true },            // what was asked to AI
  suggestion: { type: String, required: true },        // AI response shown to user
  confidence: { type: Number, min: 0, max: 1, default: 0.5 }, // 0–1 score
  accepted: { type: Boolean, default: false },         // user accepted the suggestion?
  resolved: { type: Boolean, default: false },         // did ticket resolve using this?
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who triggered
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

agentSuggestionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('AgentSuggestion', agentSuggestionSchema);

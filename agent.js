const express = require('express');
const auth = require('../middleware/auth');
const AgentSuggestion = require('../models/AgentSuggestion');
const Ticket = require('../models/Ticket');

const router = express.Router();

/**
 * Create a suggestion for a ticket
 * This is where AI would be called in future; for now we accept prompt + suggestion in body
 */
router.post('/:ticketId/suggestions', auth, async (req, res) => {
  try {
    const { prompt, suggestion, confidence = 0.5 } = req.body;
    if (!prompt || !suggestion) return res.status(400).json({ error: 'Missing fields' });

    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    const s = await AgentSuggestion.create({
      ticket: ticket._id,
      prompt,
      suggestion,
      confidence,
      createdBy: req.user.id
    });

    // Attach primary suggestion to ticket for quick access
    ticket.agentSuggestionId = s._id;
    ticket.history.push(`ai_suggestion -> ${s._id} by ${req.user.email}`);
    await ticket.save();

    return res.status(201).json(s);
  } catch {
    return res.status(400).json({ error: 'Invalid id' });
  }
});

/**
 * Mark suggestion outcome (accepted/resolved flags)
 */
router.patch('/suggestions/:id/outcome', auth, async (req, res) => {
  try {
    const { accepted, resolved } = req.body;
    const s = await AgentSuggestion.findById(req.params.id);
    if (!s) return res.status(404).json({ error: 'Not found' });
    if (accepted !== undefined) s.accepted = !!accepted;
    if (resolved !== undefined) s.resolved = !!resolved;
    await s.save();
    return res.json(s);
  } catch {
    return res.status(400).json({ error: 'Invalid id' });
  }
});

/**
 * List suggestions for a ticket
 */
router.get('/:ticketId/suggestions', auth, async (req, res) => {
  try {
    const list = await AgentSuggestion.find({ ticket: req.params.ticketId })
      .sort({ createdAt: -1 });
    return res.json(list);
  } catch {
    return res.status(400).json({ error: 'Invalid id' });
  }
});

module.exports = router;

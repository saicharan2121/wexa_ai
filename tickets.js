const express = require('express');
const auth = require('../middleware/auth');
const Ticket = require('../models/Ticket');

const router = express.Router();

// Create ticket
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category = 'other' } = req.body;
    if (!title || !description) return res.status(400).json({ error: 'Missing fields' });
    const ticket = await Ticket.create({
      title, description, category,
      createdBy: req.user.id,
      history: [`created by ${req.user.email}`]
    });
    return res.status(201).json(ticket);
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// List tickets (basic filters)
router.get('/', auth, async (req, res) => {
  try {
    const { status, my } = req.query;
    const q = {};
    if (status) q.status = status;
    if (my === 'created') q.createdBy = req.user.id;
    if (my === 'assigned') q.assignee = req.user.id;

    const tickets = await Ticket.find(q)
      .sort({ updatedAt: -1 })
      .populate('createdBy', 'email')
      .populate('assignee', 'email');
    return res.json(tickets);
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get one
router.get('/:id', auth, async (req, res) => {
  try {
    const t = await Ticket.findById(req.params.id)
      .populate('createdBy', 'email')
      .populate('assignee', 'email');
    if (!t) return res.status(404).json({ error: 'Not found' });
    return res.json(t);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid id' });
  }
});

// Update status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['open', 'triaged', 'waiting_human', 'resolved', 'closed'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const t = await Ticket.findById(req.params.id);
    if (!t) return res.status(404).json({ error: 'Not found' });
    t.status = status;
    t.history.push(`status -> ${status} by ${req.user.email}`);
    await t.save();
    return res.json(t);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid id' });
  }
});

// Assign ticket
router.patch('/:id/assign', auth, async (req, res) => {
  try {
    const { assigneeId } = req.body;
    if (!assigneeId) return res.status(400).json({ error: 'assigneeId required' });

    const t = await Ticket.findById(req.params.id);
    if (!t) return res.status(404).json({ error: 'Not found' });
    t.assignee = assigneeId;
    t.history.push(`assigned -> ${assigneeId} by ${req.user.email}`);
    await t.save();
    return res.json(t);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid id' });
  }
});

// Add comment
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { body } = req.body;
    if (!body) return res.status(400).json({ error: 'body required' });

    const t = await Ticket.findById(req.params.id);
    if (!t) return res.status(404).json({ error: 'Not found' });

    t.comments.push({ author: req.user.id, body });
    t.history.push(`comment by ${req.user.email}`);
    await t.save();
    return res.status(201).json(t);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid id' });
  }
});

module.exports = router;

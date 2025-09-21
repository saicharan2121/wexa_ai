const express = require('express');
const auth = require('../middleware/auth');
const Article = require('../models/Article');

const router = express.Router();

// Create
router.post('/', auth, async (req, res) => {
  try {
    const { title, body, tags = [] } = req.body;
    if (!title || !body) return res.status(400).json({ error: 'Missing fields' });
    const a = await Article.create({ title, body, tags, author: req.user.id });
    return res.status(201).json(a);
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// List (supports published filter, tag search, text search in title)
router.get('/', auth, async (req, res) => {
  try {
    const { published, tag, q } = req.query;
    const filter = {};
    if (published === 'true') filter.published = true;
    if (published === 'false') filter.published = false;
    if (tag) filter.tags = tag;
    if (q) filter.title = new RegExp(q, 'i');

    const list = await Article.find(filter)
      .sort({ updatedAt: -1 })
      .populate('author', 'email');
    return res.json(list);
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get by id
router.get('/:id', auth, async (req, res) => {
  try {
    const a = await Article.findById(req.params.id).populate('author', 'email');
    if (!a) return res.status(404).json({ error: 'Not found' });
    return res.json(a);
  } catch {
    return res.status(400).json({ error: 'Invalid id' });
  }
});

// Update (title/body/tags)
router.patch('/:id', auth, async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    const a = await Article.findById(req.params.id);
    if (!a) return res.status(404).json({ error: 'Not found' });

    if (title !== undefined) a.title = title;
    if (body !== undefined) a.body = body;
    if (tags !== undefined) a.tags = tags;
    await a.save();
    return res.json(a);
  } catch {
    return res.status(400).json({ error: 'Invalid id' });
  }
});

// Publish / Unpublish
router.patch('/:id/publish', auth, async (req, res) => {
  try {
    const { published } = req.body;
    if (typeof published !== 'boolean') return res.status(400).json({ error: 'published must be boolean' });
    const a = await Article.findById(req.params.id);
    if (!a) return res.status(404).json({ error: 'Not found' });
    a.published = published;
    await a.save();
    return res.json(a);
  } catch {
    return res.status(400).json({ error: 'Invalid id' });
  }
});

// Delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const a = await Article.findByIdAndDelete(req.params.id);
    if (!a) return res.status(404).json({ error: 'Not found' });
    return res.json({ ok: true });
  } catch {
    return res.status(400).json({ error: 'Invalid id' });
  }
});

module.exports = router;

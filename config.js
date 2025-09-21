const express = require('express');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const Config = require('../models/Config');

const router = express.Router();

// GET /api/config
// Anyone logged in can read the current config.
// If no config exists yet, create a default one and return it.
router.get('/', auth, async (req, res) => {
  try {
    let cfg = await Config.findOne();
    if (!cfg) {
      cfg = await Config.create({});
    }
    return res.json(cfg);
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/config
// Only admins can update the config values.
router.patch('/', auth, adminOnly, async (req, res) => {
  try {
    const { autoCloseEnabled, confidenceThreshold } = req.body;

    let cfg = await Config.findOne();
    if (!cfg) cfg = new Config({});

    if (autoCloseEnabled !== undefined) cfg.autoCloseEnabled = !!autoCloseEnabled;
    if (confidenceThreshold !== undefined) cfg.confidenceThreshold = confidenceThreshold;

    cfg.updatedBy = req.user.id;
    await cfg.save();

    return res.json(cfg);
  } catch (e) {
    return res.status(400).json({ error: 'Bad request' });
  }
});

module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedAdmin(); // ensure default admin exists
  })
  .catch(err => console.error('MongoDB connection error:', err));
  async function seedAdmin() {
  try {
    const email = process.env.DEFAULT_ADMIN_EMAIL;
    const password = process.env.DEFAULT_ADMIN_PASSWORD;

    if (!email || !password) {
      console.log('Seed admin skipped: DEFAULT_ADMIN_* not set');
      return;
    }

    const exists = await User.findOne({ email });
    if (exists) {
      console.log('Default admin already present');
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);
    await User.create({ name: 'Admin', email, password_hash, role: 'admin' });
    console.log('Default admin created:', email);
  } catch (e) {
    console.error('Admin seed error:', e.message);
  }
}


// Routes (we'll add these in Hour 3)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/config', require('./routes/config'));
app.use('/api/agent', require('./routes/agent'));

// Health Check
app.get('/healthz', (req, res) => res.json({ status: 'ok' }));


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


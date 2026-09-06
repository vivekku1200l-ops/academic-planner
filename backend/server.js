const express = require('express');
const cors = require('cors');
const { pool, initDb } = require('./db');
const { generateSchedule } = require('./scheduler');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/api/tasks', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, TO_CHAR(deadline, \'YYYY-MM-DD\') AS deadline, effort, priority, remaining, completed FROM tasks ORDER BY deadline ASC, priority DESC'
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  const { name, deadline, effort, priority } = req.body;
  if (!name || !deadline || !Number(effort) || !['high','medium','low'].includes(priority)) {
    return res.status(400).json({ error: 'Invalid task data' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO tasks (name, deadline, effort, remaining, priority)
       VALUES ($1, $2, $3, $3, $4) RETURNING id`,
      [String(name).trim(), deadline, Number(effort), priority]
    );
    res.status(201).json({ id: rows[0].id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [Number(req.params.id)]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/availability', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT hours_per_day FROM availability WHERE id=1');
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/availability', async (req, res) => {
  const hours = Number(req.body.hours_per_day);
  if (!Number.isFinite(hours) || hours <= 0 || hours > 24) {
    return res.status(400).json({ error: 'Hours must be between 0 and 24' });
  }
  try {
    await pool.query('UPDATE availability SET hours_per_day=$1 WHERE id=1', [hours]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/schedule', async (req, res) => {
  try {
    const tasksResult = await pool.query('SELECT * FROM tasks WHERE completed=0');
    const availabilityResult = await pool.query('SELECT hours_per_day FROM availability WHERE id=1');
    res.json(generateSchedule(tasksResult.rows, Number(availabilityResult.rows[0].hours_per_day), 14));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 4000;
initDb()
  .then(() => app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`)))
  .catch(err => {
    console.error('Database initialization failed:', err);
    process.exit(1);
  });

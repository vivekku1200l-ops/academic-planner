const { pool, initDb } = require('./db');

(async () => {
  await initDb();
  await pool.query('DELETE FROM tasks');
  await pool.query(`
    INSERT INTO tasks (name, deadline, effort, remaining, priority) VALUES
    ('Math Quiz Revision', CURRENT_DATE + 1, 2, 2, 'high'),
    ('English Assignment', CURRENT_DATE + 2, 3, 3, 'high'),
    ('Coding Lab Practice', CURRENT_DATE + 4, 2, 2, 'medium'),
    ('Group Project Draft', CURRENT_DATE + 5, 4, 4, 'high'),
    ('Project Research', CURRENT_DATE + 7, 6, 6, 'medium')
  `);
  console.log('Sample tasks added.');
  await pool.end();
})().catch(err => { console.error(err); process.exit(1); });

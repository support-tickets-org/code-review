const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/login', async (req, res) => {
  /**
   * Review [Critical]: sql injection vulnerability -> use parameterized queries.
   */
  const user = await db.get(
    `SELECT * FROM users WHERE email = ?`,
    [req.body.email]
  );
  if (user && user.password === req.body.password) {
    /**
     * Review [Critical]: password set in plain text -> use hashing to store passwords.
     */
    const token = jwt.sign({ id: user.id, role: user.role }, 'secret123');
    /**
     * Rview [Critical]: password is returned in the response -> do not return sensitive information like passwords.
     */
    res.json({ token, user });
  } else {
    res.status(401).send('Invalid');
  }
});

app.get('/api/orders', async (req, res) => {
  const orders = await db.all('SELECT * FROM orders');
  /**
   * Review [Critical]: sql injection vulnerability -> use parameterized queries.
   * Review [Major]: N+1 query problem -> use JOIN to fetch order items in a single query.
   */
  for (const o of orders) {
    o.items = await db.all('SELECT * FROM order_items WHERE order_id = ' + o.id);
  }
  res.json(orders);
});

app.delete('/api/orders/:id', (req, res) => {
  /**
   * Review [Critical]: sql injection vulnerability -> use parameterized queries.
   */
  db.run('DELETE FROM orders WHERE id = ' + req.params.id);
  res.json({ ok: true });
});

app.use((err, req, res, next) => {
  /**
   * Review [Major]: error handling -> do not expose stack trace in production, log it instead.
   */
  res.status(500).json({ error: err.stack });
});

app.listen(3000);

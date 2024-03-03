import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await pool.query('SELECT * FROM users');
    res.json({ users: users.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    //hashed pw function
    const hashedPassword = await bcrypt.hash(req.body.user_password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *',
      [req.body.user_name, req.body.user_email, hashedPassword]
    );
    res.json({ users: newUser.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(`${password}`, salt, (err, hash) => {
//     if (err) throw err;
//   });
// });

export default router;

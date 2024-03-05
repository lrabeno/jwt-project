import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtTokens } from '../utils/jwt-helpers.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await pool.query(
      'SELECT * FROM users WHERE user_email = $1',
      [email]
    );
    if (users.rows.length === 0) {
      return res.status(401).json({ error: 'Email is incorrect' });
    }
    //Password check
    const validPassword = await bcrypt.compare(
      password,
      users.rows[0].user_password
    );
    if (!validPassword) {
      return res.status(401).json({ error: 'Password is incorrect' });
    }
    //for project going to have issues with already non-hashed pws
    if (validPassword) {
      let tokens = jwtTokens(users.rows[0]);
      res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
      res.json(tokens);
      //return res.status(200).json('Success');
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

export default router;

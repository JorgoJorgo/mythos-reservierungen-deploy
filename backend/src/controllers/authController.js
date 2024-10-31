const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const pool = require('../db');

// Route zur Benutzerregistrierung
router.post('/register',
  [
    // Eingabevalidierung
    check('username').not().isEmpty().withMessage('Username is required'),
    check('password').isLength({ min: 4 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    // Fehler in der Eingabe validieren
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    try {
      // Passwort hashen
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Benutzer in der Datenbank speichern
      const newUser = await pool.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
        [username, hashedPassword]
      );

      // JWT erstellen
      const payload = {
        user: {
          id: newUser.rows[0].id
        }
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Token zurückgeben
      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Route zum Benutzerlogin
router.post('/login', async (req, res) => {
    // Extrahiere Benutzername und Passwort aus der Anfrage
    const { username, password } = req.body;
  
    try {
      console.log("[POST /login] Versuche User einzuloggen")
      // Benutzer in der Datenbank suchen
      const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (user.rows.length === 0) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }
  
      // Passwort überprüfen
      const isMatch = await bcrypt.compare(password, user.rows[0].password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }
  
      // JWT erstellen
      const payload = {
        user: {
          id: user.rows[0].id
        }
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Token zurückgeben
      console.log("[POST /login] User Success Login")
      res.json({ token });
    } catch (err) {
      console.error(err.message);
      console.log("[POST /login] User Failed Login")
      res.status(500).send('Server Error');
    }
  });
  

module.exports = router;

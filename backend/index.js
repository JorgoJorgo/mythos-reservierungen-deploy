const express = require('express');
const app = express();
const pool = require('./db');
const cors = require('cors');
require('dotenv').config();

// Erlaube Anfragen von allen Ursprüngen
app.use(cors());


// Middleware für das Parsen von JSON-Daten
app.use(express.json());

// Routen für Authentifizierung und Reservierungen
const authRouter = require('./controllers/authController');
const reservationRouter = require('./controllers/reservationController');
app.use('/api/auth', authRouter);
app.use('/api/reservations', reservationRouter);

// Starten des Servers auf Port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Willkommen beim Reservierungstool!');
});

const express = require('express');
const router = express.Router();
const reservationController = require('./controllers/reservationController');

// Beispielroute
router.get('/', (req, res) => {
  res.send('Welcome to the restaurant reservation API');
});

// Routen für Reservierungen
router.post('/reservations', reservationController.createReservation);
router.get('/reservations', reservationController.getReservations);

module.exports = router;

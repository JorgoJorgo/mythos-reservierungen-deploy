import React, { useState, useEffect } from 'react';
import './ReservationForm.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function ReservationForm({ selectedDate, onReservationSaved }) {
  const formatDate = (date) => {
    const d = new Date(date);
    const formattedDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    return formattedDate;
  };

  const [reservationData, setReservationData] = useState({
    date: formatDate(selectedDate), // Datum im Format 'DD/MM/YYYY'
    time: '12:00', // Beispielzeit
    customer_name: 'Mustermann', // Beispielname
    guest_count: '4', // Beispielanzahl Gäste
    employee_name: 'Jorgo', // Beispielname des Mitarbeiters
    table_number: '0', // Beispiel Tischnummer
    phone_number: '017622157949' // Beispiel Telefonnummer
  });

  // useEffect, um das Datum zu aktualisieren, wenn sich selectedDate ändert
  useEffect(() => {
    setReservationData((prevState) => ({
      ...prevState,
      date: formatDate(selectedDate),
    }));
  }, [selectedDate]);

  console.log("[ReservationForm] date:", reservationData.date);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(reservationData),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("[ReservationForm handleSubmit] reservationData:", reservationData);
        alert('Reservierung erfolgreich gespeichert!');
        
        // Aufruf der onReservationSaved Funktion nach erfolgreichem Speichern
        if (onReservationSaved) {
          onReservationSaved();
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    setReservationData({ ...reservationData, [e.target.name]: e.target.value });
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <Form onSubmit={handleSubmit} className="reservation-form">
          <div className="form-fields">
          <Form.Group className="mb-3">
            <Form.Label>Uhrzeit</Form.Label>
            <Form.Control 
              type="time"
              id="time" 
              name="time" 
              value={reservationData.time} 
              onChange={(e) => {
                // Stellt sicher, dass die Zeit im 24-Stunden-Format bleibt
                const timeValue = e.target.value;
                setReservationData({ ...reservationData, time: timeValue });
              }} 
              step="60" // Sekundenschritte deaktivieren, nur Minuten anpassen
            />
          </Form.Group>


            <Form.Group className="mb-3">
              <Form.Label>Kundenname</Form.Label>
              <Form.Control
                type="text"
                id="customer_name"
                name="customer_name"
                value={reservationData.customer_name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Anzahl der Gäste</Form.Label>
              <Form.Control
                type="number"
                id="guest_count"
                name="guest_count"
                value={reservationData.guest_count}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tischnummer</Form.Label>
              <Form.Control
                type="text"
                id="table_number"
                name="table_number"
                value={reservationData.table_number}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Telefonnummer</Form.Label>
              <Form.Control
                type="tel"
                id="phone_number"
                name="phone_number"
                value={reservationData.phone_number}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mitarbeitername</Form.Label>
              <Form.Control
                type="text"
                id="employee_name"
                name="employee_name"
                value={localStorage.getItem("username")}
                onChange={handleChange}
                disabled
                readOnly
              />
            </Form.Group>
          </div>
          <div className="button-container">
            <Button variant="success" type="submit" size="lg">
              Speichern
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default ReservationForm;

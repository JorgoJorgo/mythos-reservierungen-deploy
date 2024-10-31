import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './ReservationList.css';

const ReservationList = ({ selectedDate }) => {
  const [reservations, setReservations] = useState([]);
  const [editReservationId, setEditReservationId] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    fetchReservations(selectedDate);
  }, [selectedDate]);

  const fetchReservations = async (selectedDate) => {
    try {
      const formattedDate = formatDate(selectedDate);
      const token = sessionStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/reservations/dailyReservation?date=${formattedDate}`, {
        headers: {
          'x-auth-token': token,
        },
      });
      const data = await response.json();
      setReservations(data.sort((a, b) => a.time.localeCompare(b.time)));
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const formattedDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    return formattedDate;
  };

  const formatDateForUI = (date) => {
    const d = new Date(date);
    const formattedDate = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
    return formattedDate;
  };
  // Bearbeiten-Funktion
  const handleEditClick = (reservation) => {
    setEditReservationId(reservation.id);
    setEditedData({ ...reservation });
  };

  // Änderungen speichern
  const handleSaveClick = async () => {
    try {
      console.log("[ReservationList handleSaveClick]")
      console.log(editedData)
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/reservations/${editReservationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(editedData)
      });

      if (response.ok) {
        alert('Reservierung erfolgreich aktualisiert!');
        setEditReservationId(null); // Bearbeitungsmodus verlassen
        fetchReservations(selectedDate); // Liste neu laden
      } else {
        throw new Error('Fehler beim Speichern der Änderungen.');
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  // Löschen-Funktion
  const handleDeleteClick = async (reservationId) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (response.ok) {
        alert('Reservierung erfolgreich gelöscht!');
        fetchReservations(selectedDate); // Liste neu laden
      } else {
        throw new Error('Fehler beim Löschen der Reservierung.');
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  // Eingaben für die Bearbeitung anpassen
  const handleInputChange = (e) => {
    let { name, value } = e.target;

    if (name === "time" && value) {
      // Stelle sicher, dass die Zeit im 24-Stunden-Format bleibt
      const [hours, minutes] = value.split(":");
      value = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    }

    setEditedData({ ...editedData, [name]: value });
  };

  return (
    <div className="reservation-list">
      <hr></hr>
      <h2>Reservierungen für {formatDateForUI(selectedDate)}</h2>
      <Accordion>
        {reservations.length > 0 ? (
          reservations.map((reservation) => (
            <Accordion.Item eventKey={reservation.id} id={reservation.id} key={reservation.id}>
              <Accordion.Header> <h5>{reservation.time.slice(0, 5)} - {reservation.customer_name} - {reservation.guest_count} P </h5></Accordion.Header>
              <Accordion.Body>
                {editReservationId === reservation.id ? (
                  // Editierbare Felder, wenn die Reservierung bearbeitet wird
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Uhrzeit</Form.Label>
                      <Form.Control 
                        type="time" 
                        name="time" 
                        value={editedData.time.slice(0, 5)} // Schneidet die Sekunden ab und zeigt nur HH:MM an
                        step="60" // Sekundenschritte deaktivieren
                        onChange={handleInputChange} 
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Kunde</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="customer_name" 
                        value={editedData.customer_name} 
                        onChange={handleInputChange} 
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Anzahl der Gäste</Form.Label>
                      <Form.Control 
                        type="number" 
                        name="guest_count" 
                        value={editedData.guest_count} 
                        onChange={handleInputChange} 
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Tischnummer</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="table_number" 
                        value={editedData.table_number} 
                        onChange={handleInputChange} 
                      />
                    </Form.Group>
                    <div className="button-container">
                      <Button variant="success" onClick={handleSaveClick}>Speichern</Button>
                      <Button variant="secondary" onClick={() => setEditReservationId(null)}>Abbrechen</Button>
                    </div>
                  </>
                ) : (
                  // Nicht bearbeitbare Felder, wenn die Reservierung nicht bearbeitet wird
                  <>
                    <p>Zeit: {reservation.time.slice(0, 5)}</p>
                    <p>Kunde: {reservation.customer_name}</p>
                    <p>Gäste: {reservation.guest_count}</p>
                    <p>Tisch: {reservation.table_number}</p>
                    <p>Telefon: {reservation.phone_number}</p>
                    <p>Mitarbeiter: {reservation.employee_name}</p>
                    <p>Reservation ID: {reservation.id}</p>
                    <div className="button-container">
                      <Button variant="warning" onClick={() => handleEditClick(reservation)}>Bearbeiten</Button>
                      <Button variant="danger" onClick={() => handleDeleteClick(reservation.id)}>Löschen</Button>
                    </div>
                  </>
                )}
              </Accordion.Body>
            </Accordion.Item>
          ))
        ) : (
          <p>Keine Reservierungen für dieses Datum.</p>
        )}
      </Accordion>
      <hr></hr>
    </div>
  );
};

export default ReservationList;

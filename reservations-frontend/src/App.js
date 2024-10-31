import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ReservationForm from './components/ReservationForm';
import ReservationList from './components/ReservationList';
import LoginForm from './components/Login'; 
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

function App() {
  const [date, setDate] = useState(new Date());
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Funktion zum Einloggen
  const handleLogin = (userData) => {
    sessionStorage.setItem('token', userData.token);
    setUser(userData.user);
    setLoggedIn(true);
  };

  // Funktion zum Ausloggen
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setUser(null);
    setLoggedIn(false);
  };

  // Funktion, um nach einer Reservierung das Datum neu zu setzen (kann auf den gleichen Tag gesetzt werden)
  const handleReservationSaved = () => {
    setDate(new Date(date));  // Aktualisiert das Datum, um eine Neuladen der ReservationList zu erzwingen
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const formattedDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    return formattedDate;
  };

  return (
    <div className="App">
      {loggedIn ? (
        <>
          <div className="calendar-container">
            <Calendar onChange={setDate} value={date} />
          </div>
          <div className="reservations-list">
            <ReservationList selectedDate={date} />
          </div>
          <div className="reservation-form">
            {/* ReservationForm erhält eine Callback-Funktion als Prop */}
            <ReservationForm selectedDate={date} onReservationSaved={handleReservationSaved} />
          </div>
          <hr />
          <Button variant="danger" type="submit" onClick={handleLogout} size="lg">
            Abmelden
          </Button>
          <hr />
        </>
      ) : (
        <LoginForm className="center" onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;

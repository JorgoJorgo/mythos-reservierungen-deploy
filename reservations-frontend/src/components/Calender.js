// Calendar.js

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Calendar = ({ selectedDate, onDateChange }) => {
  return (
    <div className="calendar-container">
      <h2>Kalender</h2>
      <DatePicker selected={selectedDate} onChange={date => onDateChange(date)} />
    </div>
  );
};

export default Calendar;
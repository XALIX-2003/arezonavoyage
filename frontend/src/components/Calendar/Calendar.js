import React from 'react';
import './Calendar.css';

const Calendar = ({ availability, selectedMonth, onDateSelect, selectedDate }) => {
  if (!availability || !selectedMonth || !availability[selectedMonth]) {
    return <p>Aucune disponibilité pour le mois sélectionné.</p>;
  }

  const [monthName, year] = selectedMonth.split(' ');
  const monthIndex = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'].indexOf(monthName);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
  const availableDays = new Set(availability[selectedMonth]);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth });

  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const handleDateClick = (day) => {
    if (availableDays.has(day)) {
      onDateSelect({ day, month: monthIndex, year });
    }
  };

  return (
    <div className="calendar">
      <h4 className="text-center mb-3">{selectedMonth}</h4>
      <div className="calendar-grid">
        {weekDays.map(day => (
          <div key={day} className="calendar-header-cell">{day}</div>
        ))}
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day-cell empty"></div>
        ))}
        {days.map(day => {
          const isSelected = selectedDate && selectedDate.day === day && selectedDate.month === monthIndex && selectedDate.year === year;
          return (
            <div 
              key={day} 
              className={`calendar-day-cell ${availableDays.has(day) ? 'available' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => handleDateClick(day)}>
              {day}
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default Calendar;

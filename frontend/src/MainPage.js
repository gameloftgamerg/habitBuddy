// src/components/MainPage.js
import React, { useState, useEffect } from 'react';
import './MainPage.css'; // For styling

const MainPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [frequency, setFrequency] = useState(1);
  const [completionStatus, setCompletionStatus] = useState({});

  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  
  // Generate an array of dates for the current month
  const generateDates = () => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1);
    });
  };

  const handleAddHabit = () => {
    if (newHabit) {
      const updatedHabits = [...habits, { name: newHabit, frequency }];
      setHabits(updatedHabits);
      setNewHabit('');
      setFrequency(1);
      updateCompletionStatus(updatedHabits);
    }
  };

  const updateCompletionStatus = (updatedHabits) => {
    const status = {};
    updatedHabits.forEach(habit => {
      for (let i = 0; i < habit.frequency; i++) {
        const dateToMark = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1);
        status[dateToMark.toDateString()] = status[dateToMark.toDateString()] || [];
        status[dateToMark.toDateString()].push({ name: habit.name, completed: false });
      }
    });
    setCompletionStatus(status);
  };

  const toggleHabitCompletion = (date, habitName) => {
    setCompletionStatus(prevStatus => {
      return {
        ...prevStatus,
        [date]: prevStatus[date].map(habit =>
          habit.name === habitName ? { ...habit, completed: !habit.completed } : habit
        )
      };
    });
  };

  const handleScrollLeft = () => {
    setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)));
  };

  const handleScrollRight = () => {
    setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)));
  };

  return (
    <div className="main-page">
      <h1>Habit Tracker</h1>
      <div className="calendar">
        <button onClick={handleScrollLeft}>&lt;</button>
        <div className="dates">
          {generateDates().map(date => (
            <div
              key={date.toString()}
              className={`date ${date.toDateString() === selectedDate.toDateString() ? 'selected' : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              {date.getDate()}
            </div>
          ))}
        </div>
        <button onClick={handleScrollRight}>&gt;</button>
      </div>

      <div className="habits">
        <h2>Habits for {selectedDate.toLocaleDateString()}</h2>
        {completionStatus[selectedDate.toDateString()]?.map(habit => (
          <div key={habit.name} className={`habit ${habit.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={habit.completed}
              onChange={() => toggleHabitCompletion(selectedDate.toDateString(), habit.name)}
            />
            {habit.name}
          </div>
        ))}

        <input
          type="text"
          placeholder="Add Habit"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
        />
        <input
          type="number"
          min="1"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          placeholder="Frequency"
        />
        <button onClick={handleAddHabit}>Add Habit</button>
      </div>

      {/* Completion Status Bar */}
      <div className="status-bar">
        <h3>Status Bar</h3>
        {/* Calculate completion percentage */}
        {Object.keys(completionStatus).length > 0 && (
          <p>Monthly Progress: {((Object.values(completionStatus).flat().filter(habit => habit.completed).length) / Object.values(completionStatus).flat().length * 100).toFixed(2)}%</p>
        )}
      </div>
    </div>
  );
};

export default MainPage;
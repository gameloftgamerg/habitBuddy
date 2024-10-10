// src/components/MainPage.js
import React, { useState } from 'react';
import './MainPage.css'; // For styling

const MainPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [frequencyDays, setFrequencyDays] = useState([]);
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [habitColor, setHabitColor] = useState('#4db6ac'); // Default color

  // Generate an array of dates for the current month
  const generateDates = (monthOffset) => {
    const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + monthOffset, 1);
    const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => new Date(startDate.getFullYear(), startDate.getMonth(), i + 1));
  };

  // Handle adding a new habit
  const handleAddHabit = () => {
    if (newHabit && frequencyDays.length > 0) {
      const updatedHabits = [...habits, { name: newHabit, frequencyDays, color: habitColor }];
      setHabits(updatedHabits);
      setNewHabit('');
      setFrequencyDays([]);
      setHabitColor('#4db6ac'); // Reset to default color
    }
  };

  // Toggle completion status of a habit
  const toggleHabitCompletion = (date, habitName) => {
    setHabits(prevHabits => 
      prevHabits.map(habit =>
        habit.name === habitName 
          ? { ...habit, completed: !habit.completed } 
          : habit
      )
    );
  };

  // Change month in the calendar
  const handleScrollLeft = () => {
    setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)));
  };

  const handleScrollRight = () => {
    setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)));
  };

  // Handle frequency selection for habits
  const handleFrequencyChange = (day) => {
    if (frequencyDays.includes(day)) {
      setFrequencyDays(frequencyDays.filter(d => d !== day));
    } else {
      setFrequencyDays([...frequencyDays, day]);
    }
  };

  return (
    <div className="main-page">
      <h1>Habit Tracker</h1>
      
      {/* Calendar Navigation */}
      <div className="calendar">
        <button className="nav-button" onClick={handleScrollLeft}>&lt;</button>
        <div className="dates">
          {generateDates(0).map(date => (
            <div
              key={date.toString()}
              className={`date ${date.toDateString() === selectedDate.toDateString() ? 'selected' : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              <span>{date.getDate()}</span>
              <span>{date.toLocaleString('default', { weekday: 'short' })}</span>
            </div>
          ))}
        </div>
        <button className="nav-button" onClick={handleScrollRight}>&gt;</button>
      </div>

      {/* Habit Management Section */}
      <div className="habits">
        <h2>Habits for {selectedDate.toLocaleDateString()}</h2>
        
        {/* Display habits for the selected date */}
        {habits.filter(habit => habit.frequencyDays.includes(selectedDate.getDay())).map(habit => (
          <div key={habit.name} className="habit" style={{ backgroundColor: habit.color }}>
            <input
              type="checkbox"
              onChange={() => toggleHabitCompletion(selectedDate.toDateString(), habit.name)}
            />
            {habit.name}
          </div>
        ))}

        {/* Input for adding new habits */}
        <input
          type="text"
          placeholder="Add Habit"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
        />
        
        {/* Color picker for habit color */}
        <input
          type="color"
          value={habitColor}
          onChange={(e) => setHabitColor(e.target.value)}
        />
        
        {/* Frequency selection for habits */}
        <div className="frequency-selector">
          {[...Array(7)].map((_, index) => (
            <label key={index}>
              <input
                type="checkbox"
                checked={frequencyDays.includes(index)}
                onChange={() => handleFrequencyChange(index)}
              />
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}
            </label>
          ))}
        </div>
        
        {/* Button to add the new habit */}
        <button onClick={handleAddHabit}>Add Habit</button>
        
        {/* Button to toggle calendar view */}
        <button onClick={() => setShowCalendarView(!showCalendarView)}>Toggle Calendar View</button>
      </div>

      {/* Calendar View */}
      {showCalendarView && (
        <div className="calendar-view">
          {generateDates(0).map(date => (
            <div key={date.toString()} className={`calendar-day ${habits.some(habit => habit.frequencyDays.includes(date.getDay()) && habit.completed) ? 'completed' : ''}`}>
              {date.getDate()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MainPage;
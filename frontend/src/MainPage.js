import React, { useState, useEffect } from 'react';
import './MainPage.css'; // For styling
import { useNavigate } from 'react-router-dom';

const MainPage = ({ token, isLoggedIn }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [frequencyDays, setFrequencyDays] = useState([]);
  const [showAddHabitPopup, setShowAddHabitPopup] = useState(false);
  const navigate = useNavigate();

  // Fetch habits on login
  useEffect(() => {
    if (isLoggedIn) {
      fetchHabits();
    } else {
      navigate("/login");
    }
  }, [isLoggedIn]);

  const fetchHabits = async () => {
    try {
      const response = await fetch('http://localhost:2000/habits', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setHabits(data);
    } catch (error) {
      console.error('Failed to fetch habits:', error);
    }
  };

  const handleAddHabit = async () => {
    if (newHabit && frequencyDays.length > 0) {
      const habit = { name: newHabit, frequencyDays };
      try {
        const response = await fetch('http://localhost:2000/habits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(habit),
        });
        const data = await response.json();
        if (response.ok) {
          setHabits(prev => [...prev, data]);
        } else {
          console.error('Failed to add habit:', data.error);
        }
        resetHabitForm();
      } catch (error) {
        console.error('Failed to add habit:', error);
      }
    }
  };

  const resetHabitForm = () => {
    setNewHabit('');
    setFrequencyDays([]);
    setShowAddHabitPopup(false);
  };

  const handleFrequencyChange = (day) => {
    if (frequencyDays.includes(day)) {
      setFrequencyDays(frequencyDays.filter(d => d !== day));
    } else {
      setFrequencyDays([...frequencyDays, day]);
    }
  };

  // Carousel Navigation
  const changeDate = (days) => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + days)));
  };

  return (
    <div className="main-page">
      <h1>Habit Tracker</h1>

      <div className="carousel">
        <button className="nav-button" onClick={() => changeDate(-1)}>&lt;</button>
        <div className="dates">
          {Array.from({ length: 5 }, (_, i) => 
            <div key={i} className={`date ${i === 2 ? 'selected' : ''}`}>
              <span>{new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + i - 2).getDate().toString().padStart(2, '0')}</span>
              <span>{new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + i - 2).toLocaleString('default', { weekday: 'short' })}</span>
            </div>
          )}
        </div>
        <button className="nav-button" onClick={() => changeDate(1)}>&gt;</button>
      </div>

      <div className="habits">
        <h2>Habits for {selectedDate.toLocaleDateString('en-GB')}</h2> {/* Change here */}
        {habits.filter(habit => habit.frequencyDays.includes(selectedDate.getDay())).map(habit => (
          <div key={habit._id} className="habit" style={{ backgroundColor: '#4db6ac' }}>
            <input type="checkbox" checked={habit.completedDates.includes(selectedDate.toISOString().split('T')[0])} />
              <span>{habit.name}</span>
          </div>
        ))}

        <button onClick={() => setShowAddHabitPopup(true)}>Add Habit</button>
      </div>

      {/* Add Habit Popup */}
      {showAddHabitPopup && (
        <div className="popup">
          <h3>Add New Habit</h3>
          <input
            type="text"
            placeholder="Add Habit"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
          />
          <div className="frequency-selector">
            {[...Array(7)].map((_, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  checked={frequencyDays.includes(index)}
                  onChange={() => handleFrequencyChange(index)}
                />
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
              </label>
            ))}
          </div>
          <button onClick={handleAddHabit}>Add Habit</button>
          <button onClick={resetHabitForm}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default MainPage;
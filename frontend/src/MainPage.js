import React, { useState, useEffect } from 'react';
import './MainPage.css'; // For styling
import { useNavigate } from 'react-router-dom';

const MainPage = ({ token, isLoggedIn }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [frequencyDays, setFrequencyDays] = useState([]);
  const [habitColor, setHabitColor] = useState('#4db6ac'); // default color
  const [showAddHabitPopup, setShowAddHabitPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      fetchHabits();
    } else {
      navigate("/login");
    }
  }, [isLoggedIn]);

  const handleToggleHabit = async (habit) => {
    const date = selectedDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD

    if (habit.completedDates.includes(date)) {
        // If already completed, remove the completion
        try {
            const response = await fetch(`http://localhost:2000/habits/${habit._id}/incomplete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ date }),
            });
            if (response.ok) {
                setHabits(prev => 
                    prev.map(h => 
                        h._id === habit._id 
                            ? { ...h, completedDates: h.completedDates.filter(d => d !== date) } 
                            : h
                    )
                );
            } else {
                console.error('Failed to mark habit as incomplete:', await response.json());
            }
        } catch (error) {
            console.error('Failed to mark habit as incomplete:', error);
        }
    } else {
        // If not completed, mark it as complete
        try {
            const response = await fetch(`http://localhost:2000/habits/${habit._id}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ date }),
            });
            if (response.ok) {
                setHabits(prev => 
                    prev.map(h => 
                        h._id === habit._id 
                            ? { ...h, completedDates: [...h.completedDates, date] } 
                            : h
                    )
                );
            } else {
                console.error('Failed to mark habit as complete:', await response.json());
            }
        } catch (error) {
            console.error('Failed to mark habit as complete:', error);
        }
    }
  };

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
      const habit = { name: newHabit, frequencyDays, color: habitColor };
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
    setHabitColor('#4db6ac');
    setShowAddHabitPopup(false);
  };

  const handleFrequencyChange = (day) => {
    if (frequencyDays.includes(day)) {
      setFrequencyDays(frequencyDays.filter(d => d !== day));
    } else {
      setFrequencyDays([...frequencyDays, day]);
    }
  };

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
        <h2>Habits for {selectedDate.toLocaleDateString('en-GB')}</h2>
        {habits.filter(habit => habit.frequencyDays.includes(selectedDate.getDay())).map(habit => (
          <div key={habit._id} className="habit" style={{ backgroundColor: habit.color || '#4db6ac' }}>
            <span className={habit.completedDates.includes(selectedDate.toISOString().split('T')[0]) ? 'completed' : ''}>
              {habit.name}</span>
            <div>
              <input type = "checkbox"
              checked={habit.completedDates.includes(selectedDate.toISOString().split('T')[0])}
              onChange={() => handleToggleHabit(habit)}
              />
            </div>
          </div>
        ))}

        <button onClick={() => setShowAddHabitPopup(true)}>Add Habit</button>
      </div>

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
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  checked={frequencyDays.includes(index)}
                  onChange={() => handleFrequencyChange(index)}
                />
                {day}
              </label>
            ))}
          </div>
          <div className="color-picker">
            <label>Select Habit Color: </label>
            <input
              type="color"
              value={habitColor}
              onChange={(e) => setHabitColor(e.target.value)}
            />
          </div>
          <button onClick={handleAddHabit}>Add Habit</button>
          <button onClick={resetHabitForm}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default MainPage;

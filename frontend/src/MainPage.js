import React, { useState, useEffect } from 'react';
import './MainPage.css'; // For styling
import { useNavigate } from 'react-router-dom';

const MainPage = ({ token, isLoggedIn }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [frequencyDays, setFrequencyDays] = useState([]);
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [habitColor, setHabitColor] = useState('#4db6ac'); // Default color
  const [reminderTime, setReminderTime] = useState(''); // New state for reminder time
  const [showAddHabitPopup, setShowAddHabitPopup] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true'); // Dark mode state
  const [editHabit, setEditHabit] = useState(null); // State for editing habit
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      fetchHabits();
    } else {
      navigate("/login");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

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
      const habit = { name: newHabit, frequencyDays, color: habitColor, reminderTime };
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

  const handleEditHabit = async () => {
    if (editHabit && editHabit.name && editHabit.frequencyDays.length > 0) {
      try {
        const response = await fetch(`http://localhost:2000/habits/${editHabit._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editHabit),
        });
        const data = await response.json();
        if (response.ok) {
          setHabits(prev => prev.map(habit => habit._id === editHabit._id ? data : habit));
        } else {
          console.error('Failed to edit habit:', data.error);
        }
        setEditHabit(null); // Close edit form
      } catch (error) {
        console.error('Failed to edit habit:', error);
      }
    }
  };

  const handleCompleteHabit = async (habitId) => {
    try {
      const date = selectedDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
      const response = await fetch(`http://localhost:2000/habits/${habitId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date }),
      });
      if (response.ok) {
        setHabits(prev => prev.map(habit => habit._id === habitId ? { ...habit, completedDates: [...habit.completedDates, date] } : habit));
      } else {
        const data = await response.json();
        console.error('Failed to complete habit:', data.error);
      }
    } catch (error) {
      console.error('Failed to complete habit:', error);
    }
  };

  // Function to handle deleting a habit
  const handleDeleteHabit = async (habitId) => {
    try {
      const response = await fetch(`http://localhost:2000/habits/${habitId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setHabits(prev => prev.filter(habit => habit._id !== habitId));
      } else {
        const data = await response.json();
        console.error('Failed to delete habit:', data.error);
      }
    } catch (error) {
      console.error('Failed to delete habit:', error);
    }
  };

  const resetHabitForm = () => {
    setNewHabit('');
    setFrequencyDays([]);
    setHabitColor('#4db6ac'); // Reset to default color
    setReminderTime(''); // Reset reminder time
    setShowAddHabitPopup(false); // Close popup
  };

  const handleFrequencyChange = (day) => {
    if (frequencyDays.includes(day)) {
      setFrequencyDays(frequencyDays.filter(d => d !== day));
    } else {
      setFrequencyDays([...frequencyDays, day]);
    }
  };

  const handleEditFrequencyChange = (day) => {
    if (editHabit.frequencyDays.includes(day)) {
      setEditHabit({ ...editHabit, frequencyDays: editHabit.frequencyDays.filter(d => d !== day) });
    } else {
      setEditHabit({ ...editHabit, frequencyDays: [...editHabit.frequencyDays, day] });
    }
  };

  // Generate an array of dates for the current month
  const generateDates = () => {
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1));
  };

  return (
    <div className="main-page">
      <h1>Habit Tracker</h1>
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>

      <div>
        {/* Calendar Navigation */}
        <div className="calendar">
          <button className="nav-button" onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}>&lt;</button>
          <div className="dates">
            <div className="date">
              <span>{selectedDate.getDate()}</span>
              <span>{selectedDate.toLocaleString('default', { weekday: 'short' })}</span>
            </div>
          </div>
          <button className="nav-button" onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}>&gt;</button>
        </div>

        {/* Habit Management Section */}
        <div className="habits">
          <h2>Habits for {selectedDate.toLocaleDateString()}</h2>
          {habits.filter(habit => habit.frequencyDays && habit.frequencyDays.includes(selectedDate.getDay())).map(habit => (
            <div key={habit._id} className="habit" style={{ backgroundColor: habit.color }}>
              <input type="checkbox" checked={habit.completedDates.includes(selectedDate.toISOString().split('T')[0])} onChange={() => handleCompleteHabit(habit._id)} />
              {habit.name}
              <button onClick={() => setEditHabit(habit)}>Edit</button>
              <button onClick={() => handleDeleteHabit(habit._id)}>Delete</button>
            </div>
          ))}

          <button onClick={() => setShowAddHabitPopup(true)}>Add Habit</button>
          <button onClick={() => setShowCalendarView(!showCalendarView)}>Toggle Calendar View</button>
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
            <input
              type="color"
              value={habitColor}
              onChange={(e) => setHabitColor(e.target.value)}
            />
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
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
            <button onClick={handleAddHabit}>Add Habit</button>
            <button onClick={resetHabitForm}>Cancel</button>
          </div>
        )}

        {/* Edit Habit Popup */}
        {editHabit && (
          <div className="popup">
            <h3>Edit Habit</h3>
            <input
              type="text"
              placeholder="Edit Habit"
              value={editHabit.name}
              onChange={(e) => setEditHabit({ ...editHabit, name: e.target.value })}
            />
            <input
              type="color"
              value={editHabit.color}
              onChange={(e) => setEditHabit({ ...editHabit, color: e.target.value })}
            />
            <div className="frequency-selector">
              {[...Array(7)].map((_, index) => (
                <label key={index}>
                  <input
                    type="checkbox"
                    checked={editHabit.frequencyDays.includes(index)}
                    onChange={() => handleEditFrequencyChange(index)}
                  />
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}
                </label>
              ))}
            </div>
            <input
              type="time"
              value={editHabit.reminderTime}
              onChange={(e) => setEditHabit({ ...editHabit, reminderTime: e.target.value })}
            />
            <button onClick={handleEditHabit}>Save Changes</button>
            <button onClick={() => setEditHabit(null)}>Cancel</button>
          </div>
        )}

        {/* Calendar View */}
        {showCalendarView && (
          <div className="calendar-view">
            {generateDates().map(date => (
              <div key={date.toString()} className={`calendar-day ${habits.some(habit => habit.frequencyDays && habit.frequencyDays.includes(date.getDay()) && habit.completedDates.includes(date.toISOString().split('T')[0])) ? 'completed' : ''}`}>
                {date.getDate()}
                {habits.filter(habit => habit.frequencyDays && habit.frequencyDays.includes(date.getDay())).map(habit => (
                  <div key={habit._id} style={{ backgroundColor: habit.color }} className={`shaded-habit ${habit.completedDates.includes(date.toISOString().split('T')[0]) ? 'completed' : ''}`}>
                    {habit.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;

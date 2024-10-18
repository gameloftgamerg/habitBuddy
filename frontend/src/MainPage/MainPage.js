import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import HabitList from './HabitList';
import AddHabitPopup from './AddHabitPopup';
import DateCarousel from './DateCarousel';
import AvatarBuilder from './AvatarBuilder';
import AvatarDisplay from './AvatarDisplay';

const MainPage = ({ token, isLoggedIn }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [habits, setHabits] = useState([]);
    const [newHabit, setNewHabit] = useState('');
    const [frequencyDays, setFrequencyDays] = useState([]);
    const [habitColor, setHabitColor] = useState('#4db6ac');
    const [showAddHabitPopup, setShowAddHabitPopup] = useState(false);
    const [avatar, setAvatar] = useState({});
    const [editAvatar, setEditAvatar] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            fetchHabits();
            fetchAvatar();
        } else {
            navigate("/login");
        }
    }, [isLoggedIn]);

    const fetchAvatar = async () => {
        try {
            const response = await fetch('http://localhost:2000/avatar', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setAvatar(data);
        } catch (error) {
            console.error('Failed to fetch avatar:', error);
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
                fetchHabits(); // Refresh habits after adding
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

    const handleViewCalendar = (habit) => {
        navigate('/calendar', { state: { habit, selectedDate } }); // Navigate with selected habit and date
    };

    return (
        <div className="main-page">
            <h1>Habit Tracker</h1>

            {/* Avatar Section */}
            <div className="avatar-section">
                <h2>Your Avatar</h2>
                <AvatarDisplay avatar={avatar} />
                <button onClick={() => setEditAvatar(!editAvatar)}>
                    {editAvatar ? 'Close Editor' : 'Edit Avatar'}
                </button>
            </div>

            {editAvatar && (
                <AvatarBuilder 
                    avatar={avatar} 
                    setAvatar={setAvatar} 
                    token={token} 
                />
            )}

            <DateCarousel 
                selectedDate={selectedDate} 
                changeDate={(days) => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + days)))} 
            />

            <h2>Habits for {selectedDate.toLocaleDateString('en-GB')}</h2>
            <HabitList 
                habits={habits.filter(habit => habit.frequencyDays.includes(selectedDate.getDay()))} 
                selectedDate={selectedDate} 
                handleViewCalendar={handleViewCalendar} // Ensure this is passed down
            />

            <button id="addhabit" onClick={() => setShowAddHabitPopup(true)}>Add Habit</button>

            {showAddHabitPopup && (
                <AddHabitPopup 
                    newHabit={newHabit}
                    setNewHabit={setNewHabit}
                    frequencyDays={frequencyDays}
                    handleFrequencyChange={(day) => setFrequencyDays(frequencyDays.includes(day) ? frequencyDays.filter(d => d !== day) : [...frequencyDays, day])}
                    habitColor={habitColor}
                    setHabitColor={setHabitColor}
                    handleAddHabit={handleAddHabit}
                    resetHabitForm={resetHabitForm}
                />
            )}
        </div>
    );
};

export default MainPage;

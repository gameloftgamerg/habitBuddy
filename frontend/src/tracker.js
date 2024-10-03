import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HabitTracker = () => {
    const [habits, setHabits] = useState([]);
    const [habitName, setHabitName] = useState('');

    const fetchHabits = async () => {
        const response = await axios.get('http://localhost:2000/habits');
        setHabits(response.data);
    };

    const addHabit = async () => {
        await axios.post('http://localhost:2000/habits', { name: habitName });
        setHabitName('');
        fetchHabits();
    };

    const completeHabit = async (id) => {
        await axios.post(`http://localhost:2000/habits/${id}/complete`);
        fetchHabits();
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    return (
        <div>
            <h1>Habit Tracker</h1>
            <input
                type="text"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                placeholder="New Habit"
            />
            <button onClick={addHabit}>Add Habit</button>

            <ul>
                {habits.map(habit => (
                    <li key={habit._id}>
                        {habit.name}
                        <button onClick={() => completeHabit(habit._id)}>Complete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HabitTracker;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HabitTracker = () => {
    const [habits, setHabits] = useState([]);
    const [habitName, setHabitName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch habits from API
    const fetchHabits = async () => {
        setLoading(true); // Start loading
        setError(null); // Reset error before making a request
        try {
            const response = await axios.get('http://localhost:2000/habits'); // Adjust URL to your actual backend
            setHabits(response.data); // Set the fetched habits into the state
        } catch (err) {
            setError('Error fetching habits');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Add a new habit
    const addHabit = async () => {
        if (!habitName.trim()) return;
        setError(null);
        try {
            setLoading(true); // Show loading while adding the habit
            await axios.post('http://localhost:2000/habits', { name: habitName });
            setHabitName(''); // Clear input field
            fetchHabits(); // Fetch the updated list of habits after adding a new one
        } catch (err) {
            setError('Error adding habit');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Mark a habit as complete
    const completeHabit = async (id) => {
        setError(null);
        try {
            await axios.post(`http://localhost:2000/habits/${id}/complete`);

            fetchHabits();
        } catch (err) {
            setError('Error completing habit');
        }
    };

    // Delete a habit
    const deleteHabit = async (id) => {
        setError(null);
        try {
            await axios.delete(`http://localhost:2000/habits/${id}`);
            fetchHabits();
        } catch (err) {
            setError('Error deleting habit');
        }
    };

    // Fetch habits on component mount

    useEffect(() => {
        fetchHabits(); // Fetch habits on component mount
    }, []);

    return (
        <div>
            <h1>Habit Tracker</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display errors */}
            <input
                type="text"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                placeholder="New Habit"
            />
            <button onClick={addHabit} disabled={loading}>
                {loading ? 'Adding...' : 'Add Habit'}
            </button>

            {loading ? (
                <p>Loading habits...</p>
            ) : (
                <ul>
                    {habits.map(habit => (
                        <li key={habit._id}>
                            {habit.name} 
                            <button onClick={() => completeHabit(habit._id)} disabled={habit.completedDates.length > 0}>
                                Complete
                            </button>
                            <button onClick={() => deleteHabit(habit._id)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HabitTracker;

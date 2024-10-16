// AddHabitPopup.js
import React from 'react';


const AddHabitPopup = ({ newHabit, setNewHabit, frequencyDays, handleFrequencyChange, habitColor, setHabitColor, handleAddHabit, resetHabitForm }) => {
    return (
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
    );
};

export default AddHabitPopup;
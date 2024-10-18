// HabitItem.js
import React from 'react';


const HabitItem = ({ habit, selectedDate, handleToggleHabit }) => {
    return (
        <div className="habit" style={{ backgroundColor: habit.color || '#4db6ac' }}>
            <div>
                <input 
                type="checkbox"
                checked={habit.completedDates.includes(selectedDate.toISOString().split('T')[0])}
                onChange={() => handleToggleHabit(habit)}
            />
            </div>

            <span className={habit.completedDates.includes(selectedDate.toISOString().split('T')[0]) ? 'completed' : ''}>
                {habit.name}
            </span>

            {/* Buttons for Statistics, Edit, Delete */}
            <div className="button-group">
                <button className="stats-button">
                <img className = "button-icon" alt = "Statistics" src = "\bar-chart.png" />
                </button>
                <button className="edit-button">
                    <img className = "button-icon" alt = "Edit" src = "\edit1.png" />
                </button>
                <button className="delete-button">
                    <img className = "button-icon" alt = "Delete" src = "\delete.png" />
                </button>

                {/* onClick={() => onShowStats(habit.id)}  onClick={() => onEdit(habit.id)}  onClick={() => onDelete(habit.id)} */}
            </div>

        </div>
    );
};

export default HabitItem;
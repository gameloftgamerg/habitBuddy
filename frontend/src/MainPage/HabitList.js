// HabitList.js
import React from 'react';
import HabitItem from './HabitItem';


const HabitList = ({ habits, selectedDate, handleToggleHabit }) => {
    return (
        <div className="habits">
            {habits.map(habit => (
                <HabitItem 
                    key={habit._id} 
                    habit={habit} 
                    selectedDate={selectedDate} 
                    handleToggleHabit={handleToggleHabit} 
                />
            ))}
        </div>
    );
};

export default HabitList;
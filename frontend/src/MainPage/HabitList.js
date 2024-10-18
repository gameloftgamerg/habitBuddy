import React from 'react';
import HabitItem from './HabitItem';

const HabitList = ({ habits, selectedDate, handleToggleHabit, handleViewCalendar }) => {
    return (
        <div className="habitlist">
            {habits.map(habit => (
                <HabitItem 
                    key={habit._id} 
                    habit={habit} 
                    selectedDate={selectedDate} 
                    handleToggleHabit={handleToggleHabit} 
                    handleViewCalendar={handleViewCalendar} // Pass down the handleViewCalendar function
                />
            ))}
        </div>
    );
};

export default HabitList;

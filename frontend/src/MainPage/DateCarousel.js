// DateCarousel.js
import React from 'react';


const DateCarousel = ({ selectedDate, changeDate }) => {
    return (
        <div className="carousel">
            <button className="nav-button" onClick={() => changeDate(-1)}>&lt;</button>
            <div className="dates">
                {Array.from({ length: 5 }, (_, i) =>
                    <div key={i} className={`date ${i === 2 ? 'selected' : ''}`}>
                        <span>{new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + i - 2).getDate().toString().padStart(2, '0')}</span>
                        <span>-{new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + i - 2).toLocaleString('default', { weekday: 'short' })}</span>
                    </div>
                )}
            </div>
            <button className="nav-button" onClick={() => changeDate(1)}>&gt;</button>
        </div>
    );
};

export default DateCarousel;
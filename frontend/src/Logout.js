import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Logout = ( {setToken, setIsLoggedIn} ) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        setToken('');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <div className="logout-container">
            <h1>Do you want to logout?</h1>
            <form onSubmit={handleLogout}>
                <button type="submit">Logout</button>
            </form>
        </div>
    )
};
    
export default Logout
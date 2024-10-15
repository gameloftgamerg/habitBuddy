import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Logout = ( {setToken, setIsLoggedIn, isLoggedIn} ) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        setToken('');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <div className="logout-container">
            {isLoggedIn ? (
                <form onSubmit={handleLogout}>
                    <label><h1>Do you want to logout?</h1></label>
                    <button type="submit">Logout</button>
                </form>
            )   :  (
                <h1>Not logged in</h1>
            )}
         </div>
    )
};
    
export default Logout
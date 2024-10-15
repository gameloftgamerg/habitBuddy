// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({isLoggedIn}) => {
    return (
        <nav>
            {!isLoggedIn &&
            <Link to="/login">Login</Link> 
            }
            {!isLoggedIn &&
            <Link to="/register">Register</Link>
            }
            {isLoggedIn &&
            <Link to="/">Home</Link>
            }
            {isLoggedIn &&
            <Link to="/logout">Logout</Link>
            }
        </nav>
        
    );
};

export default Navbar;


// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ setToken }) => {
    return (
        <nav>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/">Home</Link>
            <Link to="/logout">Logout</Link>
        </nav>
    );
};

export default Navbar;


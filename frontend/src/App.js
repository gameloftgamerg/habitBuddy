import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HabitTracker from './tracker';
import Register from './Register';
import Login from './Login';
import Navbar from './Navbar'; // Import the Navbar
import MainPage from './MainPage';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    return (
        <Router>
            <Navbar /> 
            <Routes>
                <Route path="/register" element={<Register setToken={setToken} />} />
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route path="/" element={<MainPage token={token} setToken={setToken} />} />
            </Routes>
        </Router>
    );
};

export default App;



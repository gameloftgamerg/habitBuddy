import React from 'react';
import HabitTracker from './tracker';
import Register from './Register';
// import Login from './Login';
import Navbar from './Navbar'; // Import the Navbar
import MainPage from './MainPage';
import Login from './Login 2';

const App = () => {
    return (
        <Router>
            <Navbar /> 
            <Routes>
                <Route path="/register" element={<Register setToken={setToken} />} />
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route path="/" element={<HabitTracker token={token} setToken={setToken} />} />
                <Route path="/main" element={<MainPage setToken={setToken} />} />
            </Routes>
        </Router>
    );
};

export default App
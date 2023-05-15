import React, { useState } from "react";
import axios from 'axios';

const MMLogin = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            await axios.post("/api/auth/login", { name, password });
            setSuccess('Login successful');
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError('Email is already registered');
            } else {
                setError('Something went wrong');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mmRegisterForm">
            <h2>Login</h2>
            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button type="submit">Login</button>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
        </form>
    );
};

export default MMLogin;
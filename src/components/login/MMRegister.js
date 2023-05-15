import React, { useState } from "react";
import axios from 'axios';

const MMRegister = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            await axios.post("/api/auth/register", { email, name, password });
            setSuccess('Registration successful');
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
            <h2>Register</h2>
            <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
            />
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
            <button type="submit">Register</button>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
        </form>
    );
};

export default MMRegister;
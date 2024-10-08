import React, {useContext, useEffect, useState} from "react";
import axios from 'axios';
import {BackGroundContext} from "../../BackGroundContext";

interface MMRegisterProps {
    successfulRegister: () => void;
}
const MMRegister = ({successfulRegister}: MMRegisterProps) => {
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const {resetLoginRegisterValue} = useContext(BackGroundContext);

    useEffect(()=>{
        setEmail("");
        setUserName("");
        setPassword("");
        setError(null);
        setSuccess(null);
    },[resetLoginRegisterValue])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            await axios.post("/api/auth/register", {userName: userName, email: email, password: password});
            setSuccess('Registration successful');
            successfulRegister();
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                setError(error.response.data);
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
                value={userName}
                onChange={e => setUserName(e.target.value)}
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
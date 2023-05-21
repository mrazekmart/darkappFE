import React, {useState} from "react";
import axios from 'axios';

const MMLogin = ({successfullLogin}) => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.post("/api/auth/login", {userName: userName, password: password});
            setSuccess('Login successful');
            if (response.data) {
                const token = response.data.token;
                localStorage.setItem('jwt', token);
            }
            successfullLogin();
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 409) {
                setError(error.response.data);
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
            <button type="submit">Login</button>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
        </form>
    );
};

export default MMLogin;
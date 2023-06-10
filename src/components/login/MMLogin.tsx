import React, {useContext, useEffect, useState} from "react";
import axios from 'axios';
import {BackGroundContext} from "../../BackGroundContext";

interface MMLoginProps {
    successfulLogin: () => void;
}
const MMLogin = ({successfulLogin}: MMLoginProps) => {
    const [userNameLoginForm, setUserNameLoginForm] = useState("");
    const [passwordLoginForm, setPasswordLoginForm] = useState("");
    const [errorLoginForm, setErrorLoginForm] = useState<string | null>(null);
    const [successLoginForm, setSuccessLoginForm] = useState<string | null>(null);

    const {resetLoginRegisterValue, setUserNameProfile} = useContext(BackGroundContext);

    useEffect(()=>{
        setUserNameLoginForm("");
        setPasswordLoginForm("");
        setErrorLoginForm(null);
        setSuccessLoginForm(null);
    },[resetLoginRegisterValue])
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorLoginForm(null);
        setSuccessLoginForm(null);

        try {
            const response = await axios.post("/api/auth/login", {userName: userNameLoginForm, password: passwordLoginForm});
            setSuccessLoginForm('Login successful');
            if (response.data) {
                const token = response.data.token;
                localStorage.setItem('jwt', token);
            }
            setUserNameProfile(userNameLoginForm);
            successfulLogin();
        } catch (error: any) {
            console.log(error);
            if (error.response && error.response.status === 409) {
                setErrorLoginForm(error.response.data);
            } else {
                setErrorLoginForm('Something went wrong');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mmRegisterForm">
            <h2>Login</h2>
            <input
                type="text"
                value={userNameLoginForm}
                onChange={e => setUserNameLoginForm(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                value={passwordLoginForm}
                onChange={e => setPasswordLoginForm(e.target.value)}
                placeholder="Password"
            />
            <button type="submit">Login</button>
            {errorLoginForm && <p className="error">{errorLoginForm}</p>}
            {successLoginForm && <p className="success">{successLoginForm}</p>}
        </form>
    );
};

export default MMLogin;
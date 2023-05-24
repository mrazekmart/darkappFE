import React, {useContext, useEffect, useState} from 'react';
import MMDropdownMenu from "./MMDropDownMenu";
import MMModal from "./MMModal";
import MMRegister from "./login/MMRegister";
import MMLogin from "./login/MMLogin";
import {BackGroundContext} from "../BackGroundContext";
import axios from "axios";

const MMBody = () => {
    const [registerShow, setRegisterShow] = useState(false);
    const [loginShow, setLoginShow] = useState(false);
    const [logInOutButtonText, setLogInOutButtonText] = useState("Login");
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [showRegisterButton, setShowRegisterButton] = useState(true);
    const {
        setZIndex,
        setColorFractal,
        setColorBackground,
        setPositionFractal,
        setZoomFractal,
        resetLoginRegisterValue,
        setResetLoginRegisterValue,
        setUserNameProfile
    } = useContext(BackGroundContext);
    const handleRegisterClose = () => setRegisterShow(false);
    const handleLoginClose = () => setLoginShow(false);
    const handleRegisterShow = () => setRegisterShow(true);
    const handleLoginShow = () => setLoginShow(true);

    const switchToLogin = () => {
        setRegisterShow(false);
        setLoginShow(true)
    };

    const successfulRegister = () => {
        handleRegisterClose();
        setResetLoginRegisterValue(!resetLoginRegisterValue);
    }
    const successfulLogin = () => {
        handleLoginClose();
        setIsUserLoggedIn(true);
        getFractalInfo();
        setResetLoginRegisterValue(!resetLoginRegisterValue);
        setShowRegisterButton(false);
    }
    const successfulLogout = () => {
        localStorage.removeItem('jwt');
        setIsUserLoggedIn(false);
        setResetLoginRegisterValue(!resetLoginRegisterValue);
        setUserNameProfile("John");
        setShowRegisterButton(true);
    }

    const handleLogInOutButton = () => {
        if (!isUserLoggedIn) {
            handleLoginShow();
        } else {
            successfulLogout();
        }
    }

    useEffect(() => {
        if (isUserLoggedIn) {
            setLogInOutButtonText("Logout");
        } else {
            setLogInOutButtonText("Login");
        }
    }, [isUserLoggedIn]);

    const getFractalInfo = async () => {
        const token = localStorage.getItem('jwt');
        try {
            const response = await axios.get("/api/user/getFractalInfo", {headers: {"Authorization": `Bearer ${token}`}});
            if (response.data) {
                setColorFractal(response.data.colorFractal);
                setColorBackground(response.data.colorBackground);
                setPositionFractal(response.data.positionFractal);
                setZoomFractal(response.data.zoomFractal);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="d-flex flex-wrap mmBtn-container">
            <div>
                <MMDropdownMenu
                    title="Sorting"
                    menuItems={[
                        {label: 'BubbleSort', path: '/sorting/bubblesort'},
                        {label: 'QuickSort', path: '/sorting/quicksort'},
                    ]}
                />
                <MMDropdownMenu
                    title="Noises"
                    menuItems={[
                        {label: 'Perlin Noise', path: '/noises/perlin'},
                        {label: 'Noises Option 2', path: '/noises/option2'},
                    ]}
                />
                <MMDropdownMenu
                    title="Fractals"
                    menuItems={[
                        {label: 'Mandelbrot set', onClick: () => setZIndex(10)},
                    ]}
                />
                <MMDropdownMenu
                    title="Games"
                    menuItems={[
                        {label: 'Conquer', path: '/games'},
                    ]}
                />
            </div>
            <div className="mmRegisterButtonsContainer">
                {showRegisterButton && (
                    <button className="mmScience-btn mmRegisterButton" onClick={handleRegisterShow}>Register</button>)}
                <button className="mmScience-btn mmRegisterButton"
                        onClick={handleLogInOutButton}>{logInOutButtonText}</button>
            </div>
            <MMModal show={registerShow} handleClose={handleRegisterClose}>
                <MMRegister successfulRegister={successfulRegister}/>
                <div className="flex-direction-row flex-justify-content-center">
                    <p>Already registered?</p>
                    <button className="mmScience-btn mmRegisterToLoginButton" onClick={switchToLogin}>Login</button>
                </div>
            </MMModal>
            <MMModal show={loginShow} handleClose={handleLoginClose}>
                <MMLogin successfulLogin={successfulLogin}/>
            </MMModal>
        </div>
    );
};

export default MMBody;
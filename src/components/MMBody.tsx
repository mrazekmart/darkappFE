import React, {useContext, useEffect, useState} from 'react';
import MMDropdownMenuButton from "./MMDropdownMenuButton";
import MMModal from "./MMModal";
import MMRegister from "./login/MMRegister";
import MMLogin from "./login/MMLogin";
import {BackGroundContext} from "../BackGroundContext";
import axios from "axios";

const MMBody = () => {
    const [registerShow, setRegisterShow] = useState(false);
    const [loginShow, setLoginShow] = useState(false);
    const [showRegisterButton, setShowRegisterButton] = useState(true);
    const {
        setBackGroundZIndex,
        setColorFractal,
        setColorBackground,
        setPositionFractal,
        setZoomFractal,
        resetLoginRegisterValue, setResetLoginRegisterValue,
        setUserNameProfile,
        setProfilePicture,
        userLoggingOut, setUserLoggingOut,
        isUserLoggedIn, setIsUserLoggedIn
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
        getUserProfileSettings();
        setIsUserLoggedIn(true);
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
        successfulLogout();
        // eslint-disable-next-line
    }, [userLoggingOut]);

    const getUserProfileSettings = async () => {
        const token = localStorage.getItem('jwt');
        try {
            const response = await axios.get("/api/user/getUserProfileSettings", {headers: {"Authorization": `Bearer ${token}`}});
            if (response.data) {
                setColorFractal(response.data.mmFractalInfo.colorFractal);
                setColorBackground(response.data.mmFractalInfo.colorBackground);
                setPositionFractal(response.data.mmFractalInfo.positionFractal);
                setZoomFractal(response.data.mmFractalInfo.zoomFractal);
                if(response.data.userProfilePicture){
                    const imageDataUrl = `data:image/png;base64,${response.data.userProfilePicture}`;
                    setProfilePicture(imageDataUrl);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="d-flex flex-wrap mmBtn-container">
            <div>
                <MMDropdownMenuButton
                    title="Sorting"
                    menuItems={[
                        {label: 'BubbleSort', path: '/sorting/bubblesort'},
                        {label: 'QuickSort', path: '/sorting/quicksort'},
                    ]}
                />
                <MMDropdownMenuButton
                    title="Noises"
                    menuItems={[
                        {label: 'Perlin Noise', path: '/noises/perlin'},
                        {label: 'Noises Option 2', path: '/noises/option2'},
                    ]}
                />
                <MMDropdownMenuButton
                    title="Fractals"
                    menuItems={[
                        {label: 'Mandelbrot set', onClick: () => setBackGroundZIndex(10)},
                    ]}
                />
                <MMDropdownMenuButton
                    title="Games"
                    menuItems={[
                        {label: 'Conquer', path: '/games'},
                    ]}
                />
            </div>
            <div className="mmRegisterButtonsContainer">
                {showRegisterButton && (
                    <button className="mmScience-btn mmRegisterButton" onClick={handleRegisterShow}>Register</button>)
                }
                {showRegisterButton &&
                    <button className="mmScience-btn mmRegisterButton"
                        onClick={handleLogInOutButton}>Login</button>
                }
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
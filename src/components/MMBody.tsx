import React, {useContext, useEffect, useState} from 'react';
import MMDropdownMenuButton from "./MMDropdownMenuButton";
import MMModal from "./MMModal";
import MMRegister from "./login/MMRegister";
import MMLogin from "./login/MMLogin";
import {BackGroundContext} from "../BackGroundContext";
import {getUserProfileSettings} from './api/MMApiServices';

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
        userLoggingOut,
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
        getUserProfileSettings(
            setColorFractal,
            setColorBackground,
            setPositionFractal,
            setZoomFractal,
            setProfilePicture
        )
            .then(() => {
                setIsUserLoggedIn(true);
                setResetLoginRegisterValue(!resetLoginRegisterValue);
                setShowRegisterButton(false);
            })
            .catch(err => {
                console.error(err);
            });
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

    return (
        <div className="d-flex flex-wrap mmBtn-container">
            <div>
                <MMDropdownMenuButton
                    title="Noises"
                    menuItems={[
                        {label: 'Perlin Noise', path: '/noises/perlin'},
                        {label: 'Planet', path: '/noises/planet'},
                    ]}
                />
                <MMDropdownMenuButton
                    title="Sorting"
                    menuItems={[
                        {label: 'BubbleSort', path: '/sorting/bubblesort'},
                    ]}
                />
                <MMDropdownMenuButton
                    title="Fractals"
                    menuItems={[
                        {label: 'Mandelbrot set', onClick: () => setBackGroundZIndex(10)},
                    ]}
                />
                <MMDropdownMenuButton
                    title="Universe"
                    menuItems={[
                        {label: 'Randomly generated universe', path: '/universe'},
                    ]}
                />
                <MMDropdownMenuButton
                    title="Recipes"
                    menuItems={[
                        {label: 'Air fryer recipes', path: '/recipe'},
                    ]}
                />
                <button className="mmScience-btn mmCustomizeBackground-btn"
                        onClick={() => setBackGroundZIndex(10)}>
                    Customize background!
                </button>
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
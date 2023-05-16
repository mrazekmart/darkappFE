import React, {useContext, useState} from 'react';
import MMDropdownMenu from "./MMDropDownMenu";
import MMModal from "./MMModal";
import MMRegister from "./login/MMRegister";
import MMLogin from "./login/MMLogin";
import {ZIndexContext} from "../ZIndexContext";

const MMBody = () => {
    const [registerShow, setRegisterShow] = useState(false);
    const [loginShow, setLoginShow] = useState(false);
    const handleRegisterClose = () => setRegisterShow(false);
    const handleLoginClose = () => setLoginShow(false);
    const handleRegisterShow = () => setRegisterShow(true);
    const handleLoginShow = () => setLoginShow(true);
    const switchToLogin = () => {
        setRegisterShow(false);
        setLoginShow(true)
    };

    const { setZIndex } = useContext(ZIndexContext);

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
                <button className="mmScience-btn mmRegisterButton" onClick={handleRegisterShow}>Register</button>
                <button className="mmScience-btn mmRegisterButton" onClick={handleLoginShow}>Login</button>
            </div>
            <MMModal show={registerShow} handleClose={handleRegisterClose}>
                <MMRegister/>
                <div className="flex-direction-row flex-justify-content-center">
                    <p>Already registered?</p>
                    <button className="mmScience-btn mmRegisterToLoginButton" onClick={switchToLogin}>Login</button>
                </div>
            </MMModal>
            <MMModal show={loginShow} handleClose={handleLoginClose}>
                <MMLogin/>
            </MMModal>
        </div>
    );
};

export default MMBody;
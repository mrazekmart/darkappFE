import React, {useContext, useEffect, useRef, useState} from "react";
import {BackGroundContext} from "../../BackGroundContext";
import axios from "axios";
import MMDropdownMenuText from "../MMDropdownMenuText";
import {MenuItem} from "../menuItems";
import {getUserProfileSettings} from "../api/MMApiServices";
import MMModal from "../MMModal";
import MMRegister from "./MMRegister";
import MMLogin from "./MMLogin";

const MMProfile = () => {
    const {
        userNameProfile,
        profilePicture,
        setProfilePicture,
        userLoggingOut,
        isUserLoggedIn, setIsUserLoggedIn,
        setUserLoggingOut,
        resetLoginRegisterValue, setResetLoginRegisterValue,
        setColorFractal,
        setColorBackground,
        setPositionFractal,
        setZoomFractal,
        setUserNameProfile,
    } = useContext(BackGroundContext);
    const [profilePictureFile, setProfilePictureFile] = useState<File | undefined>(undefined);
    const [uploadPicture, setUploadPicture] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([{label: ""}]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [registerShow, setRegisterShow] = useState(false);
    const [loginShow, setLoginShow] = useState(false);
    const [showRegisterButton, setShowRegisterButton] = useState(true);

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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setUploadPicture(true);
        setProfilePictureFile(file);
        loadPicture(file);
    };
    const handleProfilePictureClick = () => {
        if (fileInputRef.current !== null) {
            fileInputRef.current.click();
        }
    };

    const loadPicture = (file?: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setProfilePicture(result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (uploadPicture) {
            handleSubmit();
        }
        setUploadPicture(false);
        // eslint-disable-next-line
    }, [profilePictureFile]);

    const changeSetUserLoggingOut = () => {
        setUserLoggingOut(!userLoggingOut);
    }


    const handleSubmit = () => {
        const token = localStorage.getItem('jwt');
        if (profilePicture) {
            const formData = new FormData();
            if (profilePictureFile) {
                formData.append('file', profilePictureFile);
            }

            axios.post('/api/user/updateProfilePicture', formData, {headers: {"Authorization": `Bearer ${token}`}})
                .then(response => {
                })
                .catch(error => {
                });
        }
    };

    useEffect(() => {
        if (isUserLoggedIn) {
            setMenuItems(menuItemsLogout);
        }else{
            setMenuItems(menuItemsEmpty);
        }
        // eslint-disable-next-line
    }, [isUserLoggedIn]);

    const menuItemsLogout = [
        {label: 'Logout', onClick: changeSetUserLoggingOut},
    ];

    const menuItemsEmpty = [{label:""}];

    return (
        <div className="mmUserProfile mmProfileContainer">
            <div className="mmRegisterButtonsContainer">
                <button
                    className="mmScience-btn mmRegisterButton"
                    onClick={handleRegisterShow}
                    style={{ visibility: showRegisterButton ? 'visible' : 'hidden' }}>
                    Register
                </button>
                <button
                    className="mmScience-btn mmRegisterButton"
                    onClick={handleLogInOutButton}
                    style={{ visibility: showRegisterButton ? 'visible' : 'hidden' }}>
                    Login
                </button>
            </div>
            <div>
                <button className="mmUserProfileButton" onClick={handleProfilePictureClick}>
                    <img src={profilePicture} alt="" className="mmProfilePicture"/>
                    <span className="mmUserProfileHoverText">Click to upload a picture</span>
                </button>
                <div>
                    <MMDropdownMenuText
                        title={userNameProfile}
                        menuItems= {menuItems}
                    />
                </div>
                <input
                    type="file"
                    accept=".png"
                    ref={fileInputRef}
                    style={{display: 'none'}}
                    onChange={handleFileChange}
                />
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

export default MMProfile;


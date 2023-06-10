import React, {useContext, useEffect, useRef, useState} from "react";
import {BackGroundContext} from "../../BackGroundContext";
import axios from "axios";
import MMDropdownMenuText from "../MMDropdownMenuText";

const MMProfile = () => {
    const {
        userNameProfile,
        profilePicture,
        setProfilePicture,
        userLoggingOut,
        isUserLoggedIn,
        setUserLoggingOut
    } = useContext(BackGroundContext);
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [uploadPicture, setUploadPicture] = useState(false);
    const [menuItems, setMenuItems] = useState([{}]);

    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setUploadPicture(true);
        setProfilePictureFile(file);
        loadPicture(file);
    };
    const handleProfilePictureClick = (event) => {
        fileInputRef.current.click();
    };

    const loadPicture = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePicture(reader.result);
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
        console.log(profilePicture);
        if (profilePicture) {
            const formData = new FormData();
            formData.append('file', profilePictureFile);

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
        console.log(menuItems);
        // eslint-disable-next-line
    }, [isUserLoggedIn]);

    const menuItemsLogout = [
        {label: 'Logout', onClick: changeSetUserLoggingOut},
    ];

    const menuItemsEmpty = [{}];

    return (
        <div className="mmUserProfile mmProfileContainer">
            <button className="mmUserProfileButton" onClick={handleProfilePictureClick}>
                <img src={profilePicture} alt="" className="mmProfilePicture"/>
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
    );
};

export default MMProfile;


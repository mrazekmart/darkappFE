import React, {useContext, useState} from "react";
import {BackGroundContext} from "../../BackGroundContext";
import axios from "axios";

const MMProfile = () => {
    const {userNameProfile, profilePicture, setProfilePicture} = useContext(BackGroundContext);
    const [profilePictureFile, setProfilePictureFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setProfilePictureFile(file);
        loadPicture(file);
    };
    const handleProfilePictureClick = (event) => {
    };

    const loadPicture = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePicture(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
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

    return (
        <div className="user-profile mmProfileContainer">
            <button className="" onClick={handleProfilePictureClick}>
                <img src={profilePicture} alt="" className="profile-picture" />
            </button>
            <h2 className="name">{userNameProfile}</h2>
            {/*<input type="file" accept="image/*" onChange={handleFileChange} />*/}
            <form onSubmit={handleSubmit}>
                <input type="file" accept=".png" onChange={handleFileChange}/>
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default MMProfile;


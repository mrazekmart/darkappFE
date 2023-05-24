import React, {useContext, useState} from "react";
import dp from "../../dp.png";
import {BackGroundContext} from "../../BackGroundContext";
import axios from "axios";

const MMProfile = () => {
    const [profilePicture, setProfilePicture] = useState(dp);
    const {userNameProfile} = useContext(BackGroundContext);
    const handleFileChange = (event) => {
        setProfilePicture(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const token = localStorage.getItem('jwt');
        if (profilePicture) {
            const formData = new FormData();
            formData.append('file', profilePicture);

            axios.post('/api/user/updateProfilePicture', formData, {headers: {"Authorization": `Bearer ${token}`}})
                .then(response => {
                })
                .catch(error => {
                });
        }
    };

    return (
        <div className="user-profile mmProfileContainer">
            <img src={profilePicture} alt="" className="profile-picture"/>
            <h2 className="name">{userNameProfile}</h2>
            {/*<input type="file" accept="image/*" onChange={handleFileChange} />*/}
            <form onSubmit={handleSubmit}>
                <input type="file" accept=".png" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default MMProfile;


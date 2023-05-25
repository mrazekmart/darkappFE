import React, {useContext} from "react";
import {BackGroundContext} from "../../BackGroundContext";
import axios from "axios";

const MMProfile = () => {
    const {userNameProfile, profilePicture, setProfilePicture} = useContext(BackGroundContext);
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setProfilePicture(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
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


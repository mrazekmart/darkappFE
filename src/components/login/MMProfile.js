import React, {useContext, useState} from "react";
import dp from "../../dp.png";
import {BackGroundContext} from "../../BackGroundContext";

const MMProfile = () => {
    const [profilePicture, setProfilePicture] = useState(dp);
    const {userNameProfile} = useContext(BackGroundContext);
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

    console.log(userNameProfile);
    return (
        <div className="user-profile mmProfileContainer">
            <img src={profilePicture} alt="User Profile Picture" className="profile-picture"/>
            <h2 className="name">{userNameProfile}</h2>
            {/*<input type="file" accept="image/*" onChange={handleFileChange} />*/}
        </div>);
};

export default MMProfile;


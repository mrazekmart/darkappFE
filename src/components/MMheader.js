import React, {useState} from 'react';

const Header = () => {

    const[name, setName] = useState("test");
    return (
        <div className="mmTitle-container">
            <div>
                <h1 className="mmTitle">!Programming && !Science</h1>
            </div>
            <p className="mmSubTitle">Explore the world of science and programming</p>
        </div>
    );
};

export default Header;
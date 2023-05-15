import React, {useState} from 'react';
import {Link} from 'react-router-dom';

const MMDropdownMenu = ({title, menuItems}) => {

    return (
        <div className="mmDropdown">
            <button className="mmScience-btn">{title}</button>
            <div className="mmDropdown-menu">
                {menuItems.map((item, index) => (
                    <Link key={index} to={item.path} className="mmDropdown-item">
                        {item.label}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MMDropdownMenu;
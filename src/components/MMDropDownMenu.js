import React, {useState} from 'react';
import {Link} from 'react-router-dom';

const MMDropdownMenu = ({title, menuItems}) => {

    return (
        <div className="mmDropdown">
            <button className="mmScience-btn">{title}</button>
            <div className="mmDropdown-menu">
                {menuItems.map((item, index) => {
                    if (item.path) {
                        return (
                            <Link key={index} to={item.path} className="mmDropdown-item">
                                {item.label}
                            </Link>
                        );
                    } else if (item.onClick) {
                        return (
                            <button key={index} onClick={item.onClick} className="mmDropdown-item">
                                {item.label}
                            </button>
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default MMDropdownMenu;
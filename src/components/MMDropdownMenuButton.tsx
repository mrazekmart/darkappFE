import React from 'react';
import {Link} from 'react-router-dom';
import {MenuItem} from "./menuItems";

interface MMDropdownMenuButtonProps {
    title: string;
    menuItems: MenuItem[];
}

const MMDropdownMenuButton: React.FC<MMDropdownMenuButtonProps> = ({ title, menuItems }) => {
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
                            <button key={index} onClick={item.onClick} className="mmScience-btn">
                                {item.label}
                            </button>
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default MMDropdownMenuButton;
import React from 'react';
import {Link} from 'react-router-dom';

interface MenuItem {
    label: string;
    path?: string;
    onClick?: () => void;
}

interface MMDropdownMenuTextProps {
    title: string;
    menuItems: MenuItem[];
}
const MMDropdownMenuText: React.FC<MMDropdownMenuTextProps> = ({ title, menuItems }) => {

    return (
        <div className="mmDropdown">
            <h1 className="mmName">{title}</h1>
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
                    return null;
                })}
            </div>
        </div>
    );
};

export default MMDropdownMenuText;
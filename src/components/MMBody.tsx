import React, {useContext} from 'react';
import MMDropdownMenuButton from "./MMDropdownMenuButton";

import {BackGroundContext} from "../BackGroundContext";

const MMBody = () => {
    const {
        setBackGroundZIndex,
    } = useContext(BackGroundContext);


    return (
        <div className="mmBtn-container flex-justify-content-center">
            <div>
                <MMDropdownMenuButton
                    title="Noises"
                    menuItems={[
                        {label: 'Perlin Noise', path: '/noises/perlin'},
                        {label: 'Planet', path: '/noises/planet'},
                    ]}
                />
                <MMDropdownMenuButton
                    title="Sorting"
                    menuItems={[
                        {label: 'BubbleSort', path: '/sorting/bubblesort'},
                    ]}
                />
                <MMDropdownMenuButton
                    title="Fractals"
                    menuItems={[
                        {label: 'Mandelbrot set', onClick: () => setBackGroundZIndex(10)},
                    ]}
                />
                <MMDropdownMenuButton
                    title="Universe"
                    menuItems={[
                        {label: 'Randomly generated universe', path: '/universe'},
                    ]}
                />
                <MMDropdownMenuButton
                    title="MMPlayGround"
                    menuItems={[
                        {label: 'Air fryer recipes', path: '/recipe'},
                        {label: 'Discord Time', path: '/discord'},
                    ]}
                />
                <button className="mmScience-btn mmCustomizeBackground-btn"
                        onClick={() => setBackGroundZIndex(10)}>
                    Customize background!
                </button>
            </div>
        </div>
    );
};

export default MMBody;
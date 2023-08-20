import React, {useState, useEffect, useRef} from "react";
import {initializeThreeGrid} from "./MMGridMaker";

const MMTDGridMakerManager: React.FC = () => {

    useEffect(() => {
        initializeThreeGrid('MMTDGridMakerContainer', 50);
    }, []);


    return (
        <div>
            <div id="MMTDGridMakerContainer"></div>
        </div>
    );
}

export default MMTDGridMakerManager;
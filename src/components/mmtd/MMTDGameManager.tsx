import React, {useEffect, useState} from "react";
import {initializeThreeGrid} from "./MMTDGame";
import {MMWaveManager} from "./waves/MMWaveManager";
import {MMBuilderMode} from "./builder/MMBuilderMode";

const MMTDGameManager: React.FC = () => {

    const [showTowerList, setShowTowerList] = useState(false);

    const handleTowerClick = (towerType: number) => {
        MMBuilderMode.getInstance().turnOn();
        MMBuilderMode.getInstance().towerToPlaceType = towerType;
    };

    useEffect(() => {
        initializeThreeGrid('MMTDContainer');
    }, []);

    const handleNextWaveButton = () => {
        MMWaveManager.getInstance().nextWave();
    }

    const placeTowersButton = () => {
        setShowTowerList(!showTowerList);
        MMBuilderMode.getInstance().turnOff();
    }

    return (
        <div>
            <div className="flex-direction-column">
                <div className="mmtdButtonContainer">
                    <button className="mmtdButton" onClick={handleNextWaveButton}>Next Wave</button>
                    <button className="mmtdButton" onClick={placeTowersButton}>Place Towers</button>
                </div>
                {showTowerList && (
                    <div className="sci-fi-container">
                        <h2>Select a Tower</h2>
                        <ul className="sci-fi-button-list">
                            <li className="sci-fi-button-list-item">
                                <button onClick={() => handleTowerClick(0)}>Basic Tower</button>
                            </li>
                            <li className="sci-fi-button-list-item">
                                <button onClick={() => handleTowerClick(1)}>Slowing Tower</button>
                            </li>
                            <li className="sci-fi-button-list-item">
                                <button onClick={() => handleTowerClick(2)}>Gravity Shaper Tower</button>
                            </li>
                            <li className="sci-fi-button-list-item">
                                <button onClick={() => handleTowerClick(3)}>Lighting Strike Tower</button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
            <div id="MMTDContainer"></div>
        </div>
    );
}

export default MMTDGameManager;
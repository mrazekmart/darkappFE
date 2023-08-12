import React, {useContext, useState} from "react";
import axios from "axios";
import {BackGroundContext} from "../../BackGroundContext";

const MMBackgroundSettings = () => {
    const [redColorFractal, setRedColorFractal] = useState("255");
    const [greenColorFractal, setGreenColorFractal] = useState("255");
    const [blueColorFractal, setBlueColorFractal] = useState("255");

    const [redColorBackground, setRedColorBackground] = useState("255");
    const [greenColorBackground, setGreenColorBackground] = useState("255");
    //const [blueColorBackground, setBlueColorBackground] = useState("255");

    const {backGroundZIndex, colorFractal, setColorFractal, colorBackground, setColorBackground, positionFractal, zoomFractal} = useContext(BackGroundContext);
    const setRGBColor = (value: number, index: number, fractal: boolean) => {
        if (fractal) {
            let newColor = [...colorFractal];
            if (value === 255) {
                newColor[index] = 1;
            } else {
                newColor[index] = (value % 256) / 255;
            }
            setColorFractal(newColor);
        } else {
            let newColor = [...colorBackground];
            if (value === 255) {
                newColor[index] = 1;
            } else {
                newColor[index] = (value % 256) / 255;
            }
            setColorBackground(newColor);
        }
    }
    const handleSaveColor = async (e: React.MouseEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt');
        try {
            await axios.post("/api/user/updateFractal", {
                colorFractal: colorFractal,
                colorBackground: colorBackground,
                positionFractal: positionFractal,
                zoomFractal: zoomFractal
            }, {headers: {"Authorization": `Bearer ${token}`}});
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <div style={{zIndex: backGroundZIndex * 2}} className="mmFractalsSettingsButtonsContainer">
            <div className="flex-direction-row flex-direction-row-space-10">
                <div className="flex-direction-column">
                    <input className="mmPerlinSlider background-red"
                           type="range"
                           min="1"
                           max="255"
                           value={redColorBackground}
                           onChange={e => {
                               setRGBColor(parseFloat(e.target.value), 0, false);
                               setRedColorBackground(e.target.value);
                           }}
                    />
                    <input className="mmPerlinSlider background-green"
                           type="range"
                           min="1"
                           max="255"
                           value={greenColorBackground}
                           onChange={e => {
                               setRGBColor(parseFloat(e.target.value), 1, false);
                               setGreenColorBackground(e.target.value);
                           }}
                    />
{/*                    <input className="mmPerlinSlider background-blue"
                           type="range"
                           min="1"
                           max="255"
                           value={blueColorBackground}
                           onChange={e => {
                               setRGBColor(e.target.value, 2, false);
                               setBlueColorBackground(e.target.value);
                           }}
                    />*/}
                </div>
                <div className="flex-direction-column">
                    <input className="mmPerlinSlider background-red"
                           type="range"
                           min="1"
                           max="255"
                           value={redColorFractal}
                           onChange={e => {
                               setRGBColor(parseFloat(e.target.value), 0, true);
                               setRedColorFractal(e.target.value);
                           }}
                    />
                    <input className="mmPerlinSlider background-green"
                           type="range"
                           min="1"
                           max="255"
                           value={greenColorFractal}
                           onChange={e => {
                               setRGBColor(parseFloat(e.target.value), 1, true);
                               setGreenColorFractal(e.target.value);
                           }}
                    />
                    <input className="mmPerlinSlider background-blue"
                           type="range"
                           min="1"
                           max="255"
                           value={blueColorFractal}
                           onChange={e => {
                               setRGBColor(parseFloat(e.target.value), 2, true);
                               setBlueColorFractal(e.target.value);
                           }}
                    />
                    <button className="mmScience-btn" onClick={handleSaveColor}>Save</button>
                </div>
            </div>
        </div>
    );
}
export default MMBackgroundSettings;
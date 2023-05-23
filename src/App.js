import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {useState} from 'react';
import './App.css';
import Header from './components/MMheader';
import Footer from './components/MMfooter';
import MMBody from './components/MMBody';
import MMSorting from "./components/MMSorting";
import MMPerlinNoise from "./components/MMNoises";
import MMConquerorGame from "./components/MMConquerorGame";
import MMMandelBrot from "./components/MMMandelBrot";
import {BackGroundContext} from './BackGroundContext';
import React from "react";
import axios from "axios";

function App() {
    const [zIndex, setZIndex] = useState(-1);

    const [redColorFractal, setRedColorFractal] = useState("255");
    const [greenColorFractal, setGreenColorFractal] = useState("255");
    const [blueColorFractal, setBlueColorFractal] = useState("255");
    const [colorFractal, setColorFractal] = useState([0.6, 0.176, 0.003]);

    const [redColorBackground, setRedColorBackground] = useState("255");
    const [greenColorBackground, setGreenColorBackground] = useState("255");
    const [blueColorBackground, setBlueColorBackground] = useState("255");
    const [colorBackground, setColorBackground] = useState([0.1, 0.1, 1]);

    const [positionFractal, setPositionFractal] = useState([-0.83, 0.38]);
    const [zoomFractal, setZoomFractal] = useState(2759);
    const [firstIni, setFirstIni] = useState(true);

    const setRGBColor = (value, index, fractal) => {
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

    const handleSaveColor = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt');
        try {
            const response = await axios.post("/api/user/updateFractal", {
                colorFractal: colorFractal,
                colorBackground: colorBackground,
                positionFractal: positionFractal,
                zoomFractal: zoomFractal
            }, {headers: {"Authorization": `Bearer ${token}`}});
            console.log(response);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Router>
            <BackGroundContext.Provider value={{
                zIndex, setZIndex,
                colorFractal, setColorFractal,
                colorBackground, setColorBackground,
                positionFractal, setPositionFractal,
                zoomFractal, setZoomFractal,
                firstIni, setFirstIni
            }}>
                <div className="backgroundComponent" style={{zIndex: zIndex}}>
                    <MMMandelBrot/>
                </div>
                <div className="container">
                    <div className="d-flex flex-wrap mmBtn-container">
                        <Header/>

                        <div style={{zIndex: zIndex * 2}} className="mmRegisterButtonsContainer">
                            <div className="flex-direction-row flex-direction-row-space-10">
                                <div className="flex-direction-column">
                                    <input className="mmPerlinSlider background-red"
                                           type="range"
                                           min="1"
                                           max="255"
                                           value={redColorBackground}
                                           onChange={e => {
                                               setRGBColor(e.target.value, 0, false);
                                               setRedColorBackground(e.target.value);
                                           }}
                                    />
                                    <input className="mmPerlinSlider background-green"
                                           type="range"
                                           min="1"
                                           max="255"
                                           value={greenColorBackground}
                                           onChange={e => {
                                               setRGBColor(e.target.value, 1, false);
                                               setGreenColorBackground(e.target.value);
                                           }}
                                    />
                                    <input className="mmPerlinSlider background-blue"
                                           type="range"
                                           min="1"
                                           max="255"
                                           value={blueColorBackground}
                                           onChange={e => {
                                               setRGBColor(e.target.value, 2, false);
                                               setBlueColorBackground(e.target.value);
                                           }}
                                    />
                                </div>
                                <div className="flex-direction-column">
                                    <input className="mmPerlinSlider background-red"
                                           type="range"
                                           min="1"
                                           max="255"
                                           value={redColorFractal}
                                           onChange={e => {
                                               setRGBColor(e.target.value, 0, true);
                                               setRedColorFractal(e.target.value);
                                           }}
                                    />
                                    <input className="mmPerlinSlider background-green"
                                           type="range"
                                           min="1"
                                           max="255"
                                           value={greenColorFractal}
                                           onChange={e => {
                                               setRGBColor(e.target.value, 1, true);
                                               setGreenColorFractal(e.target.value);
                                           }}
                                    />
                                    <input className="mmPerlinSlider background-blue"
                                           type="range"
                                           min="1"
                                           max="255"
                                           value={blueColorFractal}
                                           onChange={e => {
                                               setRGBColor(e.target.value, 2, true);
                                               setBlueColorFractal(e.target.value);
                                           }}
                                    />
                                    <button className="mmScience-btn" onClick={handleSaveColor}>Save</button>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="content-wrapper">
                        <MMBody/>
                        <Routes>
                            <Route exact path="/" element={<MMSorting/>}/>
                            <Route path="/sorting/bubblesort" element={<MMSorting/>}/>
                            <Route path="/noises/perlin" element={<MMPerlinNoise/>}/>
                            <Route path="/games" element={<MMConquerorGame/>}/>
                        </Routes>
                    </div>
                    <Footer/>
                </div>
            </BackGroundContext.Provider>
        </Router>
    );
}

export default App;

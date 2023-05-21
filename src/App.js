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
    const [redColor, setRedColor] = useState("255");
    const [greenColor, setGreenColor] = useState("255");
    const [blueColor, setBlueColor] = useState("255");

    const [color, setColor] = useState([1, 1, 1]);

    const setRGBColor = (value, index) => {
        let newColor = [...color];
        newColor[index] = (value % 255) / 255;
        console.log(newColor);
        setColor(newColor);
    }

    const handleSaveColor = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt');
        try {
            const response = await axios.post("/api/user/updateFractal", {colors: color}, { headers: { "Authorization": `Bearer ${token}` }});
            console.log(response);

        } catch (error) {
            console.log(error);

        }
    }

    return (
        <Router>
            <BackGroundContext.Provider value={{zIndex, setZIndex, color, setColor}}>
                <div className="backgroundComponent" style={{zIndex: zIndex}}>
                    <MMMandelBrot/>
                </div>
                <div className="container">
                    <div className="d-flex flex-wrap mmBtn-container">
                        <Header/>

                        <div style={{zIndex: zIndex * 2}} className="mmRegisterButtonsContainer">
                            <input
                                type="text"
                                value={redColor}
                                onChange={e => {
                                    setRGBColor(e.target.value, 0);
                                    setRedColor(e.target.value);
                                }}
                            />
                            <input
                                type="text"
                                value={greenColor}
                                onChange={e => {
                                    setRGBColor(e.target.value, 1);
                                    setGreenColor(e.target.value);
                                }}
                            />
                            <input
                                type="text"
                                value={blueColor}
                                onChange={e => {
                                    setRGBColor(e.target.value, 2);
                                    setBlueColor(e.target.value);
                                }}
                            />
                            <button className="mmScience-btn" onClick={handleSaveColor}> Save color</button>
                        </div>

                    </div>
                    <div className="content-wrapper">
                        <MMBody/>
                        <Routes>
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

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import React from "react";
import {useState} from 'react';
import './App.css';
import Header from './components/MMheader';
import Footer from './components/MMfooter';
import MMBody from './components/MMBody';
import MMSorting from "./components/MMSorting";
import MMPerlinNoise from "./components/MMNoises";
import MMConquerorGame from "./components/MMConquerorGame";
import MMMandelBrot from "./components/MMMandelBrot";
import MMProfile from "./components/login/MMProfile";
import MMBackgroundSettings from "./components/background/MMBackgroundSettings";
import {BackGroundContext} from './BackGroundContext';

function App() {
    const [backGroundZIndex, setBackGroundZIndex] = useState(-1);

    const [colorFractal, setColorFractal] = useState([0.6, 0.176, 0.003]);
    const [colorBackground, setColorBackground] = useState([0.1, 0.1, 1]);
    const [positionFractal, setPositionFractal] = useState([-0.83, 0.38]);
    const [zoomFractal, setZoomFractal] = useState(2759);

    const [resetLoginRegisterValue, setResetLoginRegisterValue] = useState(false);

    const [userNameProfile, setUserNameProfile] = useState("John");

    return (
        <Router>
            <BackGroundContext.Provider value={{
                backGroundZIndex, setBackGroundZIndex,
                colorFractal, setColorFractal,
                colorBackground, setColorBackground,
                positionFractal, setPositionFractal,
                zoomFractal, setZoomFractal,
                resetLoginRegisterValue, setResetLoginRegisterValue,
                userNameProfile, setUserNameProfile
            }}>
                <div className="backgroundComponent" style={{zIndex: backGroundZIndex}}>
                    <MMMandelBrot/>
                </div>
                <div className="container">
                    <div className="d-flex flex-wrap mmBtn-container">
                        <Header/>
                        <MMProfile/>
                        <MMBackgroundSettings/>

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

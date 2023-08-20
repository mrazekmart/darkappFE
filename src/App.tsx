import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import React from "react";
import {useState} from 'react';
import './App.css';
import Header from './components/MMheader';
import Footer from './components/MMfooter';
import MMBody from './components/MMBody';
import MMSorting from "./components/MMSorting";
import MMPerlinNoise from "./components/MMNoises";
import MMMandelBrot from "./components/background/MMMandelBrot";
import MMProfile from "./components/login/MMProfile";
import MMBackgroundSettings from "./components/background/MMBackgroundSettings";
import {BackGroundContext} from './BackGroundContext';
import dp from "./dp.png";
import MMUniverse from "./components/universe/MMUniverse";
import MMPlanet from "./components/universe/MMPlanet";
import MMRecipe from "./components/recipes/MMRecipe";
import MMDiscord from "./components/discord/MMDiscord";
import MMTDGameManager from "./components/mmtd/MMTDGameManager";
import MMTDGridMakerManager from "./components/mmtd/grid/maker/MMTDGridMakerManager";

function App() {

    //todo: going back and forth to universe comps is loosing some memory and gets laggy after some time

    const [backGroundZIndex, setBackGroundZIndex] = useState(-1);

    const [colorFractal, setColorFractal] = useState([0.6, 0.176, 0.003]);
    const [colorBackground, setColorBackground] = useState([0.1, 0.1, 1]);
    const [positionFractal, setPositionFractal] = useState([-0.83, 0.38]);
    const [zoomFractal, setZoomFractal] = useState(2759);

    const [resetLoginRegisterValue, setResetLoginRegisterValue] = useState(false);

    const [userNameProfile, setUserNameProfile] = useState("John");
    const [profilePicture, setProfilePicture] = useState(dp);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [userLoggingOut, setUserLoggingOut] = useState(false);

    return (
        <Router>
            <BackGroundContext.Provider value={{
                backGroundZIndex, setBackGroundZIndex,
                colorFractal, setColorFractal,
                colorBackground, setColorBackground,
                positionFractal, setPositionFractal,
                zoomFractal, setZoomFractal,
                resetLoginRegisterValue, setResetLoginRegisterValue,
                userNameProfile, setUserNameProfile,
                profilePicture, setProfilePicture,
                isUserLoggedIn, setIsUserLoggedIn,
                userLoggingOut, setUserLoggingOut
            }}>
                <div className="backgroundComponent" style={{zIndex: backGroundZIndex}}>
                    <MMMandelBrot/>
                </div>
                <div className="container">
                    <div className="mmBtn-container">
                        <div className="spacer"></div>
                        <div>
                            <Header/>
                        </div>
                        <div className="mmProfilePicturePosition">
                            <MMProfile/>
                        </div>
                        <MMBackgroundSettings/>

                    </div>
                    <div className="content-wrapper">
                        <MMBody/>
                        <Routes>
                            <Route path="/" element={<MMPerlinNoise/>}/>
                            <Route path="/sorting/bubblesort" element={<MMSorting/>}/>
                            <Route path="/noises/perlin" element={<MMPerlinNoise/>}/>
                            <Route path="/noises/planet" element={<MMPlanet/>}/>
                            <Route path="/universe" element={<MMUniverse/>}/>
                            <Route path="/recipe" element={<MMRecipe/>}/>
                            <Route path="/discord" element={<MMDiscord/>}/>
                            <Route path="/mmtd" element={<MMTDGameManager/>}/>
                            <Route path="/mmtdgm" element={<MMTDGridMakerManager/>}/>
                        </Routes>
                    </div>
                    <Footer/>
                </div>
            </BackGroundContext.Provider>
        </Router>
    );
}

export default App;

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
import {ZIndexContext} from './ZIndexContext';
import React from "react";

function App() {
    const [zIndex, setZIndex] = useState(-1);

    return (
        <Router>
            <ZIndexContext.Provider value={{zIndex, setZIndex}}>
                <div className="backgroundComponent" style={{zIndex: zIndex}}>
                    <MMMandelBrot/>
                </div>
                <div className="container">
                    <Header/>
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
            </ZIndexContext.Provider>
        </Router>
    );
}

export default App;

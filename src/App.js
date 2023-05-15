import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import Header from './components/MMheader';
import Footer from './components/MMfooter';
import MMBody from './components/MMBody';
import MMSorting from "./components/MMSorting";
import MMPerlinNoise from "./components/MMNoises";
import MMConquerorGame from "./components/MMConquerorGame";
import MMMandelBrot from "./components/MMMandelBrot";


function App() {
    return (
        <Router>
            <div className="container">
                <Header/>
                <div className="content-wrapper">
                    <MMBody/>
                    <Routes>
                        <Route path="/sorting/bubblesort" element={<MMSorting/>}/>
                        <Route path="/noises/perlin" element={<MMPerlinNoise/>}/>
                        <Route path="/games" element={<MMConquerorGame/>}/>
                        <Route path="/fractals/mandelbrot" element={<MMMandelBrot/>}/>
                    </Routes>
                </div>
                <Footer/>
            </div>
        </Router>
    );
}

export default App;

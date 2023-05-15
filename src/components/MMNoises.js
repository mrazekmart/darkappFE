import React, {useState, useEffect} from 'react';

const MMPerlinNoise = () => {
    const [imageDataUrl, setImageDataUrl] = useState(null);
    const [zoom, setZoom] = useState(50);
    const [density, setDensity] = useState(50);
    const [xCoord, setXCoord] = useState('');
    const [yCoord, setYCoord] = useState('');
    const [isFetching, setIsFetching] = useState(false);


    const fetchImage = async () => {
        if (isFetching) {
            return;
        }

        setIsFetching(true);
        try {
            const response = await fetch('/api/bytearray', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    zoom: zoom,
                    density: density,
                    x: xCoord,
                    y: yCoord,
                }),
            });
            const base64String = await response.text();
            const dataUrl = `data:image/png;base64,${base64String}`;
            setImageDataUrl(dataUrl);
        } catch (error) {
            console.error('Error fetching image data from API:', error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchImage();
    }, [zoom, density, xCoord, yCoord]);
    const handleChange = (event) => {
        setZoom(event.target.value);
    };
    const handleChange2 = (event) => {
        setDensity(event.target.value);
    };

    const handleInputXCoord = (event) => {
        setXCoord(event.target.value);
    };

    const handleInputYCoord = (event) => {
        setYCoord(event.target.value);
    };


    return (
        <div className="mmContainer">
            <div className="mmContainerTop">
                <div>
                    <p className="mmLabel">Perlin Scale</p>
                    <input className="mmPerlinSlider"
                           type="range"
                           min="1"
                           max="100"
                           value={zoom}
                           onChange={handleChange}
                    />
                </div>
                <div>
                    <p className="mmLabel">Perlin Density</p>
                    <input className="mmPerlinSlider"
                           type="range"
                           min="-100"
                           max="100"
                           value={density}
                           onChange={handleChange2}
                    />
                </div>
                <p className="mmLabel">X coordination OffSet</p>
                <input className="mmInput-box"
                       type="text"
                       value={xCoord}
                       onChange={handleInputXCoord}
                       placeholder="Set X coordination"
                />
                <p className="mmLabel">Y coordination OffSet</p>
                <input className="mmInput-box"
                       type="text"
                       value={yCoord}
                       onChange={handleInputYCoord}
                       placeholder="Set Y coordination"
                />
            </div>
            <div className="mmContainerDown">
                {imageDataUrl ? (
                    <img src={imageDataUrl} alt="Image from API" className="mmPerlinBox"/>
                ) : (
                    <p>Loading image...</p>
                )}

            </div>
        </div>
    );
};

export default MMPerlinNoise;
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <div className="mmContainerWrapper">
            <div className="mmContainer">
                <div className="mmContainerTop flex-direction-row-space-10">
                    <div className="flex-direction-column">
                        <div>
                            <p className="mmLabel">Perlin Scale</p>
                            <input className="mmPerlinSlider background-green"
                                   type="range"
                                   min="1"
                                   max="100"
                                   value={zoom}
                                   onChange={handleChange}
                            />
                        </div>
                        <div>
                            <p className="mmLabel">Perlin Density</p>
                            <input className="mmPerlinSlider background-green"
                                   type="range"
                                   min="-100"
                                   max="100"
                                   value={density}
                                   onChange={handleChange2}
                            />
                        </div>
                    </div>
                    <div className="flex-direction-column">
                        <div>
                            <p className="mmLabel">X coordination OffSet</p>
                            <input className="mmPerlinSlider background-green"
                                   type="range"
                                   min="0"
                                   max="3000"
                                   value={xCoord}
                                   onChange={handleInputXCoord}
                            />
                        </div>
                        <div>
                            <p className="mmLabel">Y coordination OffSet</p>
                            <input className="mmPerlinSlider background-green"
                                   type="range"
                                   min="0"
                                   max="3000"
                                   value={yCoord}
                                   onChange={handleInputYCoord}
                            />
                        </div>
                    </div>
                </div>
                <div className="mmContainerDown">
                    {imageDataUrl ? (
                        <img src={imageDataUrl} alt="" className="mmPerlinBox"/>
                    ) : (
                        <p>Loading image...</p>
                    )}

                </div>
            </div>
        </div>
    );
};

export default MMPerlinNoise;
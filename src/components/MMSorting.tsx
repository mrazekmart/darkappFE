import React, {useState, useEffect} from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

const MMSorting = () => {

    const [sortedNumbersList, setSortedNumbersList] = useState([[3, 2, 5], [2, 3, 5]]);
    const [data, setData] = useState([{name: "A", value: 4}, {name: "B",value: 3}]);
    const [step, setStep] = useState(0);
    const [inputNumbers, setInputNumbers] = useState([3, 2, 5]);
    const [timeouts, setTimeouts] = useState<NodeJS.Timeout[]>([]);
    const [isAutoRun, setIsAutoRun] = useState(false);

    const sendData = () => {
        const dataToSend = {
            numbers: inputNumbers
        }
        fetch('/api/sorted', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToSend)
        })
            .then(response => response.json())
            .then(data => setSortedNumbersList(data))
            .catch(error => console.log(error));
    }
    const buttonNextClick = () => {
        createStepData(step + 1);
    };

    const buttonAutoPlayClick = () => {
        //if button is clicked while running - it clears remaining timers and stop the autoplay
        if (isAutoRun) {
            timeouts.forEach((timeout) => {
                clearTimeout(timeout);
            });
            setTimeouts([]);
            setIsAutoRun(false);

            //if not running, run it. If it was stopped previously in the middle of a run, it continues where it ended.
        } else {
            const newTimeouts  = [];
            let iteration = 0;
            for (let i = step; i <= sortedNumbersList.length; i++) {
                const timeout = setTimeout(() => {
                    createStepData(i);
                }, iteration * 1000);
                newTimeouts.push(timeout);
                iteration++;
            }
            setTimeouts(newTimeouts);
            setIsAutoRun(true);
        }
    };
    const createStepData = (innerStep: number) => {
        setStep(innerStep);
        if (innerStep >= sortedNumbersList.length) {
            return;
        }
        const tempData = sortedNumbersList[innerStep].map((number, index) => ({
            name: String.fromCharCode(65 + index),
            value: number,
        }));
        setData(tempData);
    };

    useEffect(() => {
        createStepData(0);
    }, [sortedNumbersList]);


    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> & React.KeyboardEventHandler<HTMLInputElement> = (event) => {
        const target = event.target as HTMLInputElement;
        if ('key' in event && event.key === 'Enter') {
            sendData();
            setStep(0);
        } else {
            setInputNumbers(target.value.split(',').map(Number));
        }
    };

    return (
        <div className="mmContainerWrapper">
            <div className="mmContainer">
                <div className="mmContainerTop">
                    <p className="mmLabel">Numbers: </p>
                    <input className="mmInput-box"
                           type="text"
                           value={inputNumbers.join(',')}
                           onChange={handleInputChange}
                           onKeyDown={handleInputChange}
                    />
                </div>
                <div className="mmContainerDown">
                    <BarChart
                        width={1000}
                        height={500}
                        data={data}
                        margin={{
                            top: 5, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        <Bar dataKey="value" fill="#8884d8"/>
                    </BarChart>
                    <div className="mmButtonArea">
                        <button className="mmRightSide-button" onClick={buttonNextClick}>Next</button>
                        <button className="mmRightSide-button" onClick={buttonAutoPlayClick}>Auto-play</button>
                    </div>
                </div>
            </div>
        </div>);
};

export default MMSorting;
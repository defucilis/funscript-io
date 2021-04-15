import React, { ChangeEvent, useState, useEffect, useCallback } from "react";
import Layout from "../components/layout/Layout";
import useHandy from "../lib/HandyReact";

import {
    MdKeyboardArrowUp,
    MdKeyboardArrowRight,
    MdKeyboardArrowLeft,
    MdKeyboardArrowDown,
    MdStop,
    MdPlayArrow,
} from "react-icons/md";

import style from "./Manual.module.scss";
import Randomizer from "../components/automations/Randomizer";

const Debug = () => {
    const { handy } = useHandy();
    const [waiting, setWaiting] = useState(false);
    const [data, setData] = useState({
        doRandom: false,
        randomizeFrequency: 4,
        frequencyVariability: 2,
        randomizeSpeedAmount: 10,
        randomizeStrokeAmount: 10,
    });
    const [currentStrokeLength, setCurrentStrokeLength] = useState(50);
    const [currentStrokeSpeed, setCurrentStrokeSpeed] = useState(50);
    const [currentMode, setCurrentMode] = useState(0);
    const [strokeSpeedIncrement, setStrokeSpeedIncrement] = useState(10);
    const [strokeLengthIncrement, setStrokeLengthIncrement] = useState(10);

    const [newStrokeSpeed, setNewStrokeSpeed] = useState(0);
    const [newStrokeLength, setNewStrokeLength] = useState(0);

    useEffect(() => {
        const getStatus = async () => {
            setWaiting(true);
            console.log("get status");
            try {
                const result = await handy.getSettings();
                setCurrentStrokeLength(result.stroke);
                setCurrentStrokeSpeed(result.speed);
                setCurrentMode(result.mode);
                console.log(result);

                await handy.setMode(0);
            } catch (error) {
                console.error(error);
            }
            setWaiting(false);
        };

        if (!handy) {
            setCurrentStrokeLength(0);
            setCurrentStrokeSpeed(0);
            return;
        }
        getStatus();
    }, [handy]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === "on") {
            setData({ ...data, [e.target.id]: e.target.checked });
        } else {
            setData({ ...data, [e.target.id]: Number(e.target.value) });
        }
    };

    const setMode = useCallback(
        async (mode: number) => {
            setWaiting(true);
            console.log("set mode " + mode);
            try {
                const result = await handy.setMode(mode);
                setCurrentMode(result.mode);
                console.log(result);
                if (mode === 1) {
                    const result = await handy.setSpeed(currentStrokeSpeed);
                    console.log(result);
                }
            } catch (error) {
                console.error(error);
            }
            setWaiting(false);
        },
        [handy, currentStrokeSpeed]
    );

    const sendSpeed = useCallback(
        async (speed: number) => {
            setWaiting(true);
            console.log("send speed ", speed);
            try {
                const result = await handy.setSpeed(speed);
                setCurrentStrokeSpeed(speed);
                console.log(result);
            } catch (error) {
                console.error(error);
            }
            setWaiting(false);
        },
        [handy]
    );

    const sendStroke = useCallback(
        async (stroke: number) => {
            setWaiting(true);
            console.log("send stroke ", stroke);
            try {
                const result = await handy.setStroke(stroke);
                setCurrentStrokeLength(stroke);
                console.log(result);
            } catch (error) {
                console.error(error);
            }
            setWaiting(false);
        },
        [handy]
    );

    const stepSpeed = useCallback(
        async (up: boolean) => {
            console.log("step speed " + (up ? "up" : "down"));
            await sendSpeed(
                Math.max(
                    0,
                    Math.min(
                        100,
                        currentStrokeSpeed + (up ? strokeSpeedIncrement : -1 * strokeSpeedIncrement)
                    )
                )
            );
        },
        [sendSpeed, currentStrokeSpeed, strokeSpeedIncrement]
    );

    const stepStroke = useCallback(
        async (up: boolean) => {
            console.log("step stroke " + (up ? "up" : "down"));
            await sendStroke(
                Math.max(
                    0,
                    Math.min(
                        100,
                        currentStrokeLength +
                            (up ? strokeLengthIncrement : -1 * strokeLengthIncrement)
                    )
                )
            );
        },
        [sendStroke, currentStrokeLength, strokeLengthIncrement]
    );

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowLeft":
                    stepSpeed(false);
                    break;
                case "ArrowRight":
                    stepSpeed(true);
                    break;
                case "ArrowUp":
                    stepStroke(true);
                    break;
                case "ArrowDown":
                    stepStroke(false);
                    break;
                case "Enter":
                    if (currentMode === 0) setMode(1);
                    else setMode(0);
                    break;
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => {
            window.removeEventListener("keydown", handleKey);
        };
    }, [stepSpeed, stepStroke, setMode, currentMode]);

    useEffect(() => {
        setNewStrokeLength(currentStrokeLength);
    }, [currentStrokeLength]);

    useEffect(() => {
        setNewStrokeSpeed(currentStrokeSpeed);
    }, [currentStrokeSpeed]);

    return (
        <Layout>
            <Randomizer
                enabled={data.doRandom && currentMode === 1}
                currentStrokeLength={currentStrokeLength}
                currentStrokeSpeed={currentStrokeSpeed}
                options={data}
            />
            <div className={style.manual}>
                <div>
                    <div className={style.rawControls}>
                        <div></div>
                        <div>
                            <button disabled={waiting} onClick={() => stepStroke(true)}>
                                <MdKeyboardArrowUp className={style.svgUp} />
                            </button>
                            <p>Stroke up</p>
                        </div>
                        <div></div>
                        <div>
                            <button disabled={waiting} onClick={() => stepSpeed(false)}>
                                <MdKeyboardArrowLeft />
                            </button>
                            <p>Speed down</p>
                        </div>
                        <div>
                            <button
                                disabled={waiting}
                                onClick={() => setMode(currentMode === 0 ? 1 : 0)}
                                className={style.playStop}
                            >
                                {currentMode === 0 ? <MdPlayArrow /> : <MdStop />}
                            </button>
                            <p>{currentMode === 0 ? "Start Strokes" : "Stop Strokes"}</p>
                        </div>
                        <div>
                            <button disabled={waiting} onClick={() => stepSpeed(true)}>
                                <MdKeyboardArrowRight />
                            </button>
                            <p>Speed up</p>
                        </div>
                        <div></div>
                        <div>
                            <button disabled={waiting} onClick={() => stepStroke(false)}>
                                <MdKeyboardArrowDown className={style.svgDown} />
                            </button>
                            <p>Stroke down</p>
                        </div>
                        <div></div>
                    </div>
                    <div className={style.sliderControls}>
                        <div>
                            <label htmlFor="speed">Stroke Speed</label>
                            <input
                                disabled={waiting}
                                type="range"
                                id="speed"
                                value={newStrokeSpeed}
                                min={0}
                                max={100}
                                step={1}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setNewStrokeSpeed(Number(e.target.value))
                                }
                                onMouseUp={() => {
                                    if (newStrokeSpeed !== currentStrokeSpeed) {
                                        sendSpeed(newStrokeSpeed);
                                    }
                                }}
                            />
                            <p>{Math.round(newStrokeSpeed)}%</p>
                        </div>
                        <div>
                            <label htmlFor="stroke">Stroke Length</label>
                            <input
                                disabled={waiting}
                                type="range"
                                id="stroke"
                                value={newStrokeLength}
                                min={0}
                                max={100}
                                step={1}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setNewStrokeLength(Number(e.target.value))
                                }
                                onMouseUp={() => {
                                    if (newStrokeLength !== currentStrokeLength) {
                                        sendStroke(newStrokeLength);
                                    }
                                }}
                            />
                            <p>{Math.round(newStrokeLength)}%</p>
                        </div>
                        <div style={{ marginTop: "1rem" }}>
                            <label htmlFor="strokeSpeedIncrement">Speed Increment</label>
                            <input
                                type="range"
                                id="strokeSpeedIncrement"
                                value={strokeSpeedIncrement}
                                min={0}
                                max={100}
                                step={5}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setStrokeSpeedIncrement(Number(e.target.value))
                                }
                            />
                            <p>{Math.round(strokeSpeedIncrement)}%</p>
                        </div>
                        <div>
                            <label htmlFor="strokeLengthIncrement">Length Increment</label>
                            <input
                                type="range"
                                id="strokeLengthIncrement"
                                value={strokeLengthIncrement}
                                min={0}
                                max={100}
                                step={5}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setStrokeLengthIncrement(Number(e.target.value))
                                }
                            />
                            <p>{Math.round(strokeLengthIncrement)}%</p>
                        </div>
                    </div>
                </div>
                <div className={style.randomize}>
                    <h2>Randomization</h2>
                    <div className={style.randomizationControl}>
                        <label htmlFor="doRandom">Enable Randomize</label>
                        <input
                            type="checkbox"
                            id="doRandom"
                            checked={data.doRandom}
                            onChange={handleChange}
                        />
                        <p className={style.description}>
                            Randomize will modify the values you set slightly over time
                        </p>
                    </div>
                    <div className={style.randomizationControl}>
                        <label htmlFor="randomizeFrequency">Randomize Frequency</label>
                        <input
                            type="range"
                            id="randomizeFrequency"
                            min="2"
                            max="12"
                            step="1"
                            value={data.randomizeFrequency}
                            onChange={handleChange}
                        />
                        <p>{data.randomizeFrequency} sec</p>
                    </div>
                    <div className={style.randomizationControl}>
                        <label htmlFor="frequencyVariability">Frequency Variability</label>
                        <input
                            type="range"
                            id="frequencyVariability"
                            min="0"
                            max="10"
                            step="1"
                            value={data.frequencyVariability}
                            onChange={handleChange}
                        />
                        <p>± {data.frequencyVariability} sec</p>
                    </div>
                    <div className={style.randomizationControl}>
                        <label htmlFor="randomizeSpeedAmount">Speed Variability</label>
                        <input
                            type="range"
                            id="randomizeSpeedAmount"
                            min="0"
                            max="50"
                            step="5"
                            value={data.randomizeSpeedAmount}
                            onChange={handleChange}
                        />
                        <p>± {data.randomizeSpeedAmount}%</p>
                    </div>
                    <div className={style.randomizationControl}>
                        <label htmlFor="randomizeStrokeAmount">Stroke Variability</label>
                        <input
                            type="range"
                            id="randomizeStrokeAmount"
                            min="0"
                            max="50"
                            step="5"
                            value={data.randomizeStrokeAmount}
                            onChange={handleChange}
                        />
                        <p>± {data.randomizeStrokeAmount}%</p>
                    </div>
                    <div className={style.randomizationSummary}>
                        {!data.doRandom ? (
                            <p>Your settings will not be randomized</p>
                        ) : (
                            <>
                                <p>
                                    {`Every ${Math.round(
                                        Math.max(
                                            2,
                                            Number(data.randomizeFrequency) -
                                                Number(data.frequencyVariability)
                                        )
                                    )} - ${Math.round(
                                        Number(data.randomizeFrequency) +
                                            Number(data.frequencyVariability)
                                    )} seconds:`}
                                </p>
                                <ul>
                                    <li>
                                        {Math.round(data.randomizeSpeedAmount) === 0
                                            ? "Your stroke speed will not be randomized"
                                            : `Your stroke speed will be set to a random value between ${Math.round(
                                                  Math.max(
                                                      0,
                                                      Number(currentStrokeSpeed) -
                                                          Number(data.randomizeSpeedAmount)
                                                  )
                                              )} and ${Math.round(
                                                  Math.min(
                                                      100,
                                                      Number(currentStrokeSpeed) +
                                                          Number(data.randomizeSpeedAmount)
                                                  )
                                              )}`}
                                    </li>
                                    <li>
                                        {Math.round(data.randomizeStrokeAmount) === 0
                                            ? "Your stroke length will not be randomized"
                                            : `Your stroke length will be set to a random value between ${Math.round(
                                                  Math.max(
                                                      0,
                                                      Number(currentStrokeLength) -
                                                          Number(data.randomizeStrokeAmount)
                                                  )
                                              )} and ${Math.round(
                                                  Math.min(
                                                      100,
                                                      Number(currentStrokeLength) +
                                                          Number(data.randomizeStrokeAmount)
                                                  )
                                              )}`}
                                    </li>
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Debug;

import React, { ChangeEvent, useState } from "react";
import Layout from "../components/layout/Layout";
import useHandy from "../lib/thehandy/src/TheHandy";

const Play = () => {
    const { handy } = useHandy();
    const [waiting, setWaiting] = useState(false);
    const [data, setData] = useState({
        speed: 50,
        speedAbsolute: false,
        stroke: 50,
        strokeAbsolute: false,
        offset: 0,
    });
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === "on") {
            setData({ ...data, [e.target.id]: e.target.checked });
        } else {
            setData({ ...data, [e.target.id]: e.target.value });
        }
    };

    const getVersion = async () => {
        setWaiting(true);
        console.log("get version");
        try {
            const result = await handy.getVersion();
            console.log(result);
        } catch (error) {
            console.error(error);
        }
        setWaiting(false);
    };

    const getSettings = async () => {
        setWaiting(true);
        console.log("get settings");
        try {
            const result = await handy.getSettings();
            console.log(result);
        } catch (error) {
            console.error(error);
        }
        setWaiting(false);
    };

    const getStatus = async () => {
        setWaiting(true);
        console.log("get status");
        try {
            const result = await handy.getStatus();
            console.log(result);
        } catch (error) {
            console.error(error);
        }
        setWaiting(false);
    };

    const setMode = async (mode: number) => {
        setWaiting(true);
        console.log("set mode " + mode);
        try {
            const result = await handy.setMode(mode);
            console.log(result);
        } catch (error) {
            console.error(error);
        }
        setWaiting(false);
    };

    const toggleMode = async (mode: number) => {
        setWaiting(true);
        console.log("toggle mode " + mode);
        try {
            const result = await handy.toggleMode(mode);
            console.log(result);
        } catch (error) {
            console.error(error);
        }
        setWaiting(false);
    };

    const setSpeed = async (speed: number, absolute: boolean) => {
        setWaiting(true);
        console.log("set speed " + speed + " (absolute: " + absolute + ")");
        if (absolute) speed *= 4;
        try {
            const result = await handy.setSpeed(speed, absolute);
            console.log(result);
        } catch (error) {
            console.error(error);
        }
        setWaiting(false);
    };

    const setStroke = async (stroke: number, absolute: boolean) => {
        setWaiting(true);
        console.log("set stroke " + stroke + " (absolute: " + absolute + ")");
        if (absolute) stroke *= 1.1433;
        try {
            const result = await handy.setStroke(stroke, absolute);
            console.log(result);
        } catch (error) {
            console.error(error);
        }
        setWaiting(false);
    };

    const stepSpeed = async (up: boolean) => {
        setWaiting(true);
        console.log("step speed " + (up ? "up" : "down"));
        try {
            const result = await handy.stepSpeed(up);
            console.log(result);
        } catch (error) {
            console.error(error);
        }
        setWaiting(false);
    };

    const stepStroke = async (up: boolean) => {
        setWaiting(true);
        console.log("step stroke " + (up ? "up" : "down"));
        try {
            const result = await handy.stepStroke(up);
            console.log(result);
        } catch (error) {
            console.error(error);
        }
        setWaiting(false);
    };

    const getServerTimeOffset = async () => {
        setWaiting(true);
        console.log("get server time offset");
        try {
            const result = await handy.getServerTimeOffset();
            console.log(result);
        } catch (error) {
            console.error(error);
        }
        setWaiting(false);
    };

    const syncPrepare = async (url: string, name?: string, size?: number) => {
        setWaiting(true);
        console.log("sync prepare to " + url);
        try {
            const result = await handy.syncPrepare(url, name, size);
            console.log(result);
        } catch (error) {
            console.error(error);
        }
        setWaiting(false);
    };

    const syncPlay = async (play: boolean) => {
        setWaiting(true);
        console.log("sync play");
        try {
            const result = await handy.syncPlay(play);
            console.log(result);
        } catch (error) {
            console.error(error);
        }
        setWaiting(false);
    };

    const syncOffset = async (offset: number) => {
        setWaiting(true);
        console.log("sync offset to " + offset);
        try {
            const result = await handy.syncOffset(offset);
            console.log(result);
        } catch (error) {
            console.error(error);
        }
        setWaiting(false);
    };

    return (
        <Layout>
            <div>
                <h1>Manual Mode</h1>
                <div>
                    <button disabled={waiting} onClick={() => getVersion()}>
                        Get Version
                    </button>
                    <button disabled={waiting} onClick={() => getSettings()}>
                        Get Settings
                    </button>
                    <button disabled={waiting} onClick={() => getStatus()}>
                        Get Status
                    </button>
                    <button disabled={waiting} onClick={() => getServerTimeOffset()}>
                        Get Server Time Offset
                    </button>
                </div>
                <div>
                    <button disabled={waiting} onClick={() => setMode(0)}>
                        Set Mode Off
                    </button>
                    <button disabled={waiting} onClick={() => setMode(1)}>
                        Set Mode Auto
                    </button>
                    <button disabled={waiting} onClick={() => toggleMode(1)}>
                        Toggle Mode Auto
                    </button>
                </div>
                <div>
                    <button disabled={waiting} onClick={() => stepSpeed(false)}>
                        Step Speed Down
                    </button>
                    <input
                        type="range"
                        id="speed"
                        min="0"
                        max="100"
                        value={data.speed}
                        onChange={handleChange}
                    />
                    <input
                        type="checkbox"
                        id="speedAbsolute"
                        checked={data.speedAbsolute}
                        onChange={handleChange}
                    />
                    <button
                        disabled={waiting}
                        onClick={() => setSpeed(data.speed, data.speedAbsolute)}
                    >
                        Set Speed {data.speedAbsolute ? "mm/s" : "%"}
                    </button>
                    <button disabled={waiting} onClick={() => stepSpeed(true)}>
                        Step Speed Up
                    </button>
                </div>
                <div>
                    <button disabled={waiting} onClick={() => stepStroke(false)}>
                        Step Stroke Down
                    </button>
                    <input
                        type="range"
                        id="stroke"
                        min="0"
                        max="100"
                        value={data.stroke}
                        onChange={handleChange}
                    />
                    <input
                        type="checkbox"
                        id="strokeAbsolute"
                        checked={data.strokeAbsolute}
                        onChange={handleChange}
                    />
                    <button
                        disabled={waiting}
                        onClick={() => setStroke(data.stroke, data.strokeAbsolute)}
                    >
                        Set Stroke {data.strokeAbsolute ? "mm" : "%"}
                    </button>
                    <button disabled={waiting} onClick={() => stepStroke(true)}>
                        Step Stroke Up
                    </button>
                </div>
                <div>
                    <button
                        disabled={waiting}
                        onClick={() =>
                            syncPrepare(
                                "https://sweettecheu.s3.eu-central-1.amazonaws.com/scripts/admin/dataset.csv"
                            )
                        }
                    >
                        Sync Prepare
                    </button>
                    <button disabled={waiting} onClick={() => syncPlay(true)}>
                        Sync Play
                    </button>
                    <button disabled={waiting} onClick={() => syncPlay(false)}>
                        Sync Pause
                    </button>
                    <input
                        type="range"
                        id="offset"
                        min="-500"
                        max="500"
                        value={data.offset}
                        onChange={handleChange}
                    />
                    <button disabled={waiting} onClick={() => syncOffset(data.offset)}>
                        Set Offset
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default Play;

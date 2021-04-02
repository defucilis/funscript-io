import React, { ChangeEvent, useState } from "react";
import Layout from "../components/layout/Layout";

import style from "./Manual.module.scss";
import Cycler, { CyclerOptions } from "../components/automations/Cycler";

const Auto = () => {
    const [enabled, setEnabled] = useState(false);
    const [data, setData] = useState<CyclerOptions>({
        minSpeed: 20,
        maxSpeed: 80,
        cycleDuration: 60,
        sessionDuration: 0,
        setSpeedInterval: 0.5,
    });
    const [speed, setSpeed] = useState(0);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === "on") {
            setData({ ...data, [e.target.id]: e.target.checked });
        } else {
            setData({ ...data, [e.target.id]: Number(e.target.value) });
        }
    };

    return (
        <Layout>
            <Cycler
                enabled={enabled}
                options={data}
                onSpeedChanged={setSpeed}
            />
            <div className={style.manual}>
                <div className={style.randomize}>
                    <h2>Cycler</h2>
                    <p>Speed is {speed}</p>
                    <button onClick={() => setEnabled(!enabled)}>{enabled ? "Stop Session" : "Start Session"}</button>
                    <div className={style.randomizationControl}>
                        <label htmlFor="minSpeed">Minimum Speed</label>
                        <input
                            type="range"
                            id="minSpeed"
                            min="0"
                            max="100"
                            step="1"
                            value={data.minSpeed}
                            onChange={handleChange}
                        />
                        <p>{data.minSpeed}%</p>
                    </div>
                    <div className={style.randomizationControl}>
                        <label htmlFor="maxSpeed">Maximum Speed</label>
                        <input
                            type="range"
                            id="maxSpeed"
                            min="0"
                            max="100"
                            step="1"
                            value={data.maxSpeed}
                            onChange={handleChange}
                        />
                        <p>{data.maxSpeed}%</p>
                    </div>
                    <div className={style.randomizationControl}>
                        <label htmlFor="cycleDuration">Cycle Duration</label>
                        <input
                            type="range"
                            id="cycleDuration"
                            min="10"
                            max="240"
                            step="5"
                            value={data.cycleDuration}
                            onChange={handleChange}
                        />
                        <p>{data.cycleDuration} sec</p>
                    </div>
                    <div className={style.randomizationControl}>
                        <label htmlFor="sessionDuration">Session Duration</label>
                        <input
                            type="range"
                            id="sessionDuration"
                            min="1"
                            max="240"
                            step="1"
                            value={data.sessionDuration}
                            onChange={handleChange}
                        />
                        <p>{data.sessionDuration === 0 ? "Infinite" : (data.sessionDuration + " min")}</p>
                    </div>
                    <div className={style.randomizationControl}>
                        <label htmlFor="setSpeedInterval">Set Speed Interval</label>
                        <input
                            type="range"
                            id="setSpeedInterval"
                            min="0.5"
                            max="5"
                            step="0.5"
                            value={data.setSpeedInterval}
                            onChange={handleChange}
                        />
                        <p>{data.setSpeedInterval} sec</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Auto;

import React, { ChangeEvent, useState } from "react";

import { getLimitedScript } from "funscript-utils/lib/funTweaker";

import style from "./Modifiers.module.scss";
import { Funscript } from "funscript-utils/lib/types";
import { addFunscriptMetadata } from "funscript-utils/lib/funConverter";

type DeviceMode = "launch" | "handy" | "manual";

const FusncriptLimiter = ({
    funscript,
    onApply,
}: {
    funscript: Funscript;
    onApply?: (funscript: Funscript) => void;
}): JSX.Element => {
    const [deviceMode, setDeviceMode] = useState<DeviceMode>("handy");
    const [manualSpeed, setManualSpeed] = useState(250);

    const apply = () => {
        const newScript = addFunscriptMetadata(
            getLimitedScript(funscript, deviceMode === "manual" ? manualSpeed : deviceMode)
        );
        if (onApply) onApply(newScript);
    };

    const clear = () => {
        setDeviceMode("handy");
        setManualSpeed(250);
        if (onApply) onApply(funscript);
    };

    return (
        <div className={style.modifier}>
            <h2>Limiter</h2>
            <p className={style.description}>
                Changes position values to ensure that all actions within a script are below a speed
                threshold. Useful to ensure a script will function on a particular device.
            </p>

            <div className={style.control}>
                <label htmlFor="deviceMode">Device Mode</label>
                <select
                    id="deviceMode"
                    value={deviceMode}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        setDeviceMode(e.target.value as DeviceMode)
                    }
                >
                    <option value="launch">Launch</option>
                    <option value="handy">Handy</option>
                    <option value="manual">Manual</option>
                </select>
            </div>
            {deviceMode !== "manual" ? null : (
                <div className={style.control}>
                    <label htmlFor="manualSpeed">
                        <span>Manual Speed</span>
                        <br />
                        <span>(Half-stroke time in ms)</span>
                    </label>
                    <input
                        id="manualSpeed"
                        type="number"
                        value={manualSpeed}
                        min={50}
                        max={1000}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setManualSpeed(Number(e.target.value))
                        }
                    />
                </div>
            )}

            <button onClick={apply}>Apply Limiter</button>
            <button onClick={clear}>Reset Limiter</button>
        </div>
    );
};

export default FusncriptLimiter;

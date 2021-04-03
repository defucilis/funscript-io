import React, { useState, ChangeEvent, useEffect } from "react";

import { Funscript } from "funscript-utils/lib/types";

import style from "./Modifiers.module.scss";
import { addFunscriptMetadata } from "funscript-utils/lib/funConverter";
import { getRemappedScript } from "funscript-utils/lib/funTweaker";

const FunscriptRemapper = ({
    funscript,
    onApply,
}: {
    funscript: Funscript;
    onApply?: (funscript: Funscript) => void;
}): JSX.Element => {
    const [currentMin, setCurrentMin] = useState(0);
    const [currentMax, setCurrentMax] = useState(100);

    const [newMin, setNewMin] = useState(0);
    const [newMax, setNewMax] = useState(100);

    useEffect(() => {
        if (!funscript) return;
        let min = 100;
        let max = 0;
        funscript.actions.forEach(action => {
            min = Math.min(min, action.pos);
            max = Math.max(max, action.pos);
        });
        setCurrentMin(min);
        setCurrentMax(max);
    }, [funscript]);

    const apply = () => {
        const newScript = addFunscriptMetadata(getRemappedScript(funscript, newMin, newMax));
        if (onApply) onApply(newScript);
    };

    const clear = () => {
        setNewMin(0);
        setNewMax(100);
        if (onApply) onApply(funscript);
    };

    return (
        <div className={style.modifier}>
            <h2>Remapper</h2>
            <p className={style.description}>
                Changes the minimum and maximum position values of a script to new values
            </p>

            <div className={style.control}>
                <label htmlFor="currentMin">Current Minimum</label>
                <p id="currentMin">{currentMin}</p>
            </div>
            <div className={style.control}>
                <label htmlFor="currentMax">Current Maximum</label>
                <p id="currentMax">{currentMax}</p>
            </div>

            <div className={style.control}>
                <label htmlFor="newMin">New Minimum</label>
                <input
                    id="newMin"
                    type="number"
                    value={newMin}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNewMin(Number(e.target.value))
                    }
                />
            </div>

            <div className={style.control}>
                <label htmlFor="newMax">New Maximum</label>
                <input
                    id="newMax"
                    type="number"
                    value={newMax}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNewMax(Number(e.target.value))
                    }
                />
            </div>

            <button onClick={apply}>Apply Remapper</button>
            <button onClick={clear}>Reset Remapper</button>
        </div>
    );
};

export default FunscriptRemapper;

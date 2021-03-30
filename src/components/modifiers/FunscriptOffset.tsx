import React, { useState, ChangeEvent } from "react";

import { Funscript } from "funscript-utils/lib/types";

import style from "./Modifiers.module.scss";
import { addFunscriptMetadata } from "funscript-utils/lib/funConverter";
import { getOffsetScript } from "funscript-utils/lib/funTweaker";

const FunscriptOffset = ({
    funscript,
    onApply,
}: {
    funscript: Funscript;
    onApply?: (funscript: Funscript) => void;
}): JSX.Element => {
    const [offset, setOffset] = useState(0);

    const apply = () => {
        const newScript = addFunscriptMetadata(getOffsetScript(funscript, offset));
        if (onApply) onApply(newScript);
    };

    const clear = () => {
        setOffset(0);
        if (onApply) onApply(funscript);
    };

    return (
        <div className={style.modifier}>
            <h2>Apply Offset</h2>
            <p className={style.description}>
                Add a fixed time offset to all actions in a script to ensure proper synchronization
            </p>

            <div className={style.control}>
                <label htmlFor="offset">Offset (milliseconds)</label>
                <input
                    id="offset"
                    type="number"
                    value={offset}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setOffset(Number(e.target.value))
                    }
                />
            </div>

            <button onClick={apply}>Apply Offset</button>
            <button onClick={clear}>Reset Offset</button>
        </div>
    );
};

export default FunscriptOffset;

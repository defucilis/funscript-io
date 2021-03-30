import React, { useState, ChangeEvent } from "react";

import { Funscript } from "funscript-utils/lib/types";

import style from "./Modifiers.module.scss";
import { getHalfSpeedScript } from "funscript-utils/lib/funHalver";
import { addFunscriptMetadata } from "funscript-utils/lib/funConverter";

const FunscriptFunHalver = ({
    funscript,
    onApply,
}: {
    funscript: Funscript;
    onApply?: (funscript: Funscript) => void;
}): JSX.Element => {
    const [resetAfterPause, setResetAfterPause] = useState(false);
    const [removeShortPauses, setRemoveShortPauses] = useState(true);
    const [matchFirstDownstroke, setMatchFirstDownstroke] = useState(false);
    const [matchGroupEndPosition, setMatchGroupEndPosition] = useState(true);
    const [shortPauseDuration, setShortPauseDuration] = useState(2000);

    const apply = () => {
        const newScript = addFunscriptMetadata(
            getHalfSpeedScript(funscript, {
                resetAfterPause,
                removeShortPauses,
                matchFirstDownstroke,
                matchGroupEndPosition,
                shortPauseDuration,
            })
        );

        if (onApply) onApply(newScript);
    };

    const clear = () => {
        setResetAfterPause(false);
        setRemoveShortPauses(true);
        setMatchFirstDownstroke(false);
        setMatchGroupEndPosition(true);
        setShortPauseDuration(2000);
        if (onApply) onApply(funscript);
    };

    return (
        <div className={style.modifier}>
            <h2>FunHalver</h2>
            <p className={style.description}>
                Halves the speed of a script without sacrificing sync by changing each up+down
                stroke into a single up or down stroke.
            </p>

            <div className={style.control}>
                <label htmlFor="resetAfterPause">Reset After Pause</label>
                <input
                    id="resetAfterPause"
                    type="checkbox"
                    checked={resetAfterPause}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setResetAfterPause(e.target.checked)
                    }
                />
            </div>

            <div className={style.control}>
                <label htmlFor="removeShortPauses">Remove Short Pauses</label>
                <input
                    id="removeShortPauses"
                    type="checkbox"
                    checked={removeShortPauses}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setRemoveShortPauses(e.target.checked)
                    }
                />
            </div>

            <div className={style.control}>
                <label htmlFor="shortPauseDuration">Short Pause Duration</label>
                <input
                    id="shortPauseDuration"
                    type="number"
                    value={shortPauseDuration}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setShortPauseDuration(Number(e.target.value))
                    }
                />
            </div>

            <div className={style.control}>
                <label htmlFor="matchGroupEndPosition">Match First Downstroke</label>
                <input
                    id="matchGroupEndPosition"
                    type="checkbox"
                    checked={matchFirstDownstroke}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setMatchFirstDownstroke(e.target.checked)
                    }
                />
            </div>

            <div className={style.control}>
                <label htmlFor="matchFirstDownstroke">Match Group End Position</label>
                <input
                    id="matchFirstDownstroke"
                    type="checkbox"
                    checked={matchGroupEndPosition}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setMatchGroupEndPosition(e.target.checked)
                    }
                />
            </div>

            <button onClick={apply}>Apply FunHalver</button>
            <button onClick={clear}>Reset FunHalver</button>
        </div>
    );
};

export default FunscriptFunHalver;

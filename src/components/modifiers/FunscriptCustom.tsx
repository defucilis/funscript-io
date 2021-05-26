import React, { useState, ChangeEvent } from "react";

import { Funscript } from "funscript-utils/lib/types";

import style from "./Modifiers.module.scss";
import { addFunscriptMetadata } from "funscript-utils/lib/funConverter";

const FunscriptCustom = ({
    funscript,
    onApply,
}: {
    funscript: Funscript;
    onApply?: (funscript: Funscript) => void;
}): JSX.Element => {
    const [functionText, setFunctionText] = useState(`actions => {
    //applies a 100ms offset to all actions
    return actions.map(action => ({...action, at: action.at + 100}));
}`);
    const [error, setError] = useState("");

    const apply = () => {
        let transformActions: any = null;
        let newActions: any[] = [];
        try {
            // eslint-disable-next-line
            transformActions = eval(functionText);
        } catch {
            setError("Failed to get valid function from your script");
        }
        try {
            newActions = transformActions(funscript.actions);
            if (!Array.isArray(newActions)) {
                setError("Your function didn't return an array");
                return;
            }

            let isValid = true;
            for (let i = 0; i < newActions.length; i++) {
                const action = newActions[i];

                const keys = Object.keys(action);
                if (keys.length !== 2) {
                    isValid = false;
                    console.error("1", action);
                    break;
                }
                if (keys[0] !== "pos" && keys[0] !== "at") {
                    isValid = false;
                    console.error("2", action);
                    break;
                }
                if (keys[1] !== "pos" && keys[1] !== "at") {
                    isValid = false;
                    console.error("3", action);
                    break;
                }
                if (isNaN(action[keys[0]]) || isNaN(action[keys[1]])) {
                    isValid = false;
                    console.error("4", action);
                    break;
                }
            }
            if (!isValid) {
                setError("One or more of the Actions in your returned array was invalid");
                return;
            }
            setError("");
            if (onApply) onApply(addFunscriptMetadata({ ...funscript, actions: newActions }));
        } catch {
            setError("Failed to transform actions using your script");
        }
    };

    const clear = () => {
        if (onApply) onApply(funscript);
    };

    const reset = () => {
        setFunctionText(`actions => {
    //applies a 100ms offset to all actions
    return actions.map(action => ({...action, at: action.at + 100}));
}`);
        if (onApply) onApply(funscript);
    };

    return (
        <div className={style.modifier}>
            <h2>Run Custom Function</h2>
            <p className={style.description}>
                {`Input your own javascript function that takes in an array of Actions and returns a transformed array to be applied to the funscript.`}
                <br />
                {`Only use this if you know what you're doing, and be VERY(!!!) careful before running code others have given you!`}
                <br />
                {`Also don't blame me if the site crashes if you put in crappy code :D`}
            </p>

            {error ? <p style={{ color: "salmon" }}>{error}</p> : null}

            <div className={style.control}>
                <textarea
                    id="functionText"
                    style={{ height: "24rem", fontFamily: "monospace" }}
                    value={functionText}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        setFunctionText(e.target.value)
                    }
                ></textarea>
            </div>

            <button onClick={apply}>Apply Custom Function</button>
            <button onClick={clear}>Un-Apply Custom Function</button>
            <button onClick={reset}>Reset Custom Function</button>
        </div>
    );
};

export default FunscriptCustom;

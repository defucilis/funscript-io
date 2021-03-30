import React from "react";

import style from "./Modifiers.module.scss";

const FunscriptFunDoubler = (): JSX.Element => {
    return (
        <div className={style.modifier}>
            <h2>FunDoubler</h2>
            <p className={style.description}>
                Doubles the speed of a script without sacrificing sync by changing each up or down
                stroke into an up+down stroke.
            </p>

            <p>Coming soon!</p>
        </div>
    );
};

export default FunscriptFunDoubler;

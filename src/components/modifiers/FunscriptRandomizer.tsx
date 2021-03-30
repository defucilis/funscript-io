import React from "react";

import style from "./Modifiers.module.scss";

const FunscriptRandomizer = (): JSX.Element => {
    return (
        <div className={style.modifier}>
            <h2>Randomizer</h2>
            <p className={style.description}>
                Applies random offsets to time and position values in a script, to create variety.
            </p>

            <p>Coming soon!</p>
        </div>
    );
};

export default FunscriptRandomizer;

import React from "react";

import style from "./Modifiers.module.scss";

const FusncriptLimiter = (): JSX.Element => {
    return (
        <div className={style.modifier}>
            <h2>Limiter</h2>
            <p className={style.description}>
                Changes position values to ensure that all actions within a script are below a speed
                threshold. Useful to ensure a script will function on a particular device.
            </p>

            <p>Coming soon!</p>
        </div>
    );
};

export default FusncriptLimiter;

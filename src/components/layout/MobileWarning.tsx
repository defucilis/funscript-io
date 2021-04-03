import React from "react";

import { FaDesktop } from "react-icons/fa";
import SingleScreenPage from "./SingleScreenPage";

const MobileWarning = (): JSX.Element => {
    return (
        <SingleScreenPage>
            <div
                style={{
                    padding: "2rem",
                    textAlign: "center",
                    height: "70%",
                    display: "grid",
                    placeItems: "center",
                }}
            >
                <div>
                    <FaDesktop
                        style={{
                            color: "white",
                            fontSize: "4rem",
                        }}
                    />
                    <h1>Desktop Only</h1>
                    <p>
                        {`Right now, Funscript.io doesn't work on narrow-screen layouts`}
                        <br />
                        {`Please come back on a desktop PC, or request the desktop site if you're on a phone.`}
                        <br />
                        {`Screen Width: ${window.innerWidth}`}
                    </p>
                    <p>Sorry!</p>
                </div>
            </div>
        </SingleScreenPage>
    );
};

export default MobileWarning;

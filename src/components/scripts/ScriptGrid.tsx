import React, { useState, useEffect, CSSProperties } from "react";

import ScriptTile from "./ScriptTile";

import style from "./ScriptGrid.module.scss";
import { Script } from "../../lib/types";

const ScriptGrid = ({
    scripts,
    customStyle,
}: {
    scripts: Script[];
    customStyle?: CSSProperties;
}): JSX.Element => {
    const [tiles, setTiles] = useState([]);
    useEffect(() => {
        if (!scripts) return;
        setTiles(
            scripts.map(script => {
                return <ScriptTile key={script.slug} script={{ ...script }} />;
            })
        );
    }, [scripts]);
    return (
        <div className={style.scriptgrid} style={customStyle}>
            {tiles}
        </div>
    );
};

export default ScriptGrid;

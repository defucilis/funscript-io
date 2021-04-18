import React from "react";
import { Script } from "../../lib/types";

import { FaHeart } from "react-icons/fa";

import style from "./ScriptTile.module.scss";
import { formatDuration } from "../../lib/utils";

const viewsToString = (views: number, addViews = false): string => {
    const suffix = addViews ? (views === 1 ? " View" : " Views") : "";
    if (views > 1000000) return Math.round(views / 100000) / 10 + "M" + suffix;
    if (views > 10000) return Math.round(views / 1000) + "k" + suffix;
    if (views > 1000) return Math.round(views / 100) / 10 + "k" + suffix;
    return Math.round(views) + suffix;
};

const ScriptTile = ({ script }: { script: Script }): JSX.Element => {
    return (
        <div className={style.scripttile}>
            <a
                href={`https://scriptaxis.com/script/${script.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className={style.thumbnail}
            >
                <div className={style.imagewrapper}>
                    <img src={script.thumbnail} />
                </div>
                <div className={style.imageoverlay}></div>
                <span>{formatDuration(script.duration)}</span>
            </a>
            <div className={style.scriptname}>
                <a
                    href={`https://scriptaxis.com/script/${script.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {script.name}
                </a>
            </div>
            <div className={style.scriptcreator}>
                <a
                    href={`https://scriptaxis.com/creator/${script.creatorName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {script.creatorName}
                </a>
            </div>
            <div className={style.bottomrow}>
                <p className={style.views}>{viewsToString(script.views, true)}</p>
                {script.likeCount == 0 ? null : (
                    <div className={style.likes}>
                        <FaHeart />
                        <p>{script.likeCount}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScriptTile;

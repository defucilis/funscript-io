import React, { useState, useEffect, useRef } from "react";

import { Funscript } from "funscript-utils/lib/types";
import { renderActions, ActionsOptions } from "funscript-utils/lib/funMapper";

import style from "./FunscriptPreview.module.scss";

const FunscriptPreview = ({
    funscripts,
    width,
    height,
    options,
    showPlaybackTimeKnob,
    hoverDisplayDuration,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    onWheel,
}: {
    funscripts: Funscript[];
    width: number;
    height: number;
    options?: ActionsOptions[];
    showPlaybackTimeKnob?: boolean;
    hoverDisplayDuration?: number;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onMouseMove?: (pos: { x?: number; y?: number; localX?: number; localY?: number }) => void;
    onWheel?: (e: React.WheelEvent<HTMLCanvasElement>) => void;
}) => {
    const parentRef = useRef<HTMLDivElement>();
    const canvasRef = useRef<HTMLCanvasElement>();
    const overlayRef = useRef<HTMLDivElement>();
    const positionDisplayRef = useRef<HTMLDivElement>();
    const [localMousePos, setLocalMousePos] = useState<{ x: number; y: number }>(null);
    const [funscriptDuration, setFunscriptDuration] = useState(1);

    useEffect(() => {
        if (canvasRef.current) {
            if (funscripts.length > 0) {
                for (let i = 0; i < funscripts.length; i++) {
                    if (options[i])
                        renderActions(canvasRef.current, funscripts[i], {
                            ...options[i],
                            background: "rgba(0,0,0,0)",
                        });
                    else renderActions(canvasRef.current, funscripts[i]);
                }
            } else {
                canvasRef.current.getContext("2d").clearRect(0, 0, width, height);
            }
        }
        setFunscriptDuration(
            funscripts.reduce(
                (acc: number, funscript: Funscript) =>
                    Math.max(acc, funscript.actions.slice(-1)[0].at),
                1
            )
        );
    }, [funscripts, height, width, options]);

    useEffect(() => {
        if (!localMousePos) {
            overlayRef.current.style.setProperty("display", "none");
            return;
        }
        overlayRef.current.style.setProperty("display", "block");
        const durationAsWidth = (hoverDisplayDuration / funscriptDuration) * width;
        const min = Math.max(0, localMousePos.x * width - durationAsWidth * 0.5);
        overlayRef.current.style.setProperty("left", min + "px");
        overlayRef.current.style.setProperty("width", durationAsWidth + "px");
    }, [funscriptDuration, hoverDisplayDuration, localMousePos, width]);

    useEffect(() => {
        if (!localMousePos) return;
        let localX = localMousePos.x;
        if (localX * funscriptDuration - hoverDisplayDuration * 0.5 < 0) {
            localX = (hoverDisplayDuration * 0.5) / funscriptDuration;
            setLocalMousePos({ ...localMousePos, x: localX });
            onMouseMove({ ...localMousePos, localX });
        } else if (localX * funscriptDuration + hoverDisplayDuration * 0.5 > funscriptDuration) {
            localX = (funscriptDuration - hoverDisplayDuration * 0.5) / funscriptDuration;
            setLocalMousePos({ ...localMousePos, x: localX });
            onMouseMove({ ...localMousePos, localX });
        }
    }, [funscriptDuration, localMousePos, hoverDisplayDuration, onMouseMove]);

    const getPositionAtTime = (funscript: Funscript, time: number): number => {
        const msTime = time * 1000;
        for (let i = 1; i < funscript.actions.length; i++) {
            const lastAction = funscript.actions[i - 1];
            const curAction = funscript.actions[i];
            if (lastAction.at < msTime && curAction.at > msTime) {
                const timeLerp = (msTime - lastAction.at) / (curAction.at - lastAction.at);
                const posLerp = lastAction.pos + timeLerp * (curAction.pos - lastAction.pos);
                return posLerp;
            }
        }
        return 0;
    };

    useEffect(() => {
        if (!positionDisplayRef.current) return;
        const positionPercentage = getPositionAtTime(
            funscripts[0],
            options[0].startTime * funscripts[0].metadata.duration * 0.001 || 0
        );
        const positionOffset =
            Math.round(-4 + 5 * positionPercentage * 0.01) + Math.round(positionPercentage * 0.2); //to turn it into a percentage of the 20px height
        positionDisplayRef.current.style.setProperty(
            "bottom",
            `calc(${positionPercentage}% - ${positionOffset}px)`
        );
    }, [positionDisplayRef, funscripts, options]);

    return (
        <div
            ref={parentRef}
            className={style.funscriptPreview}
            style={{
                width: { width } + "px",
                height: { height } + "px",
                backgroundColor: options[0].background || "rgba(0,0,0,0)",
            }}
        >
            <canvas
                width={width}
                height={height - 20}
                ref={canvasRef}
                onMouseEnter={() => {
                    if (onMouseEnter) onMouseEnter();
                }}
                onMouseLeave={() => {
                    if (onMouseLeave) onMouseLeave();
                    setLocalMousePos(null);
                }}
                onMouseMove={e => {
                    const localX =
                        (e.pageX -
                            parentRef.current.offsetLeft -
                            parentRef.current.scrollLeft +
                            1) /
                        canvasRef.current.width;
                    const localY =
                        (e.pageY - parentRef.current.offsetTop - parentRef.current.scrollTop + 1) /
                        canvasRef.current.height;
                    if (onMouseMove) onMouseMove({ localX, localY });
                    setLocalMousePos({ x: localX, y: localY });
                }}
                onWheel={e => {
                    if (onWheel) onWheel(e);
                }}
            ></canvas>
            <div ref={overlayRef} className={style.overlay}></div>
            {showPlaybackTimeKnob ? (
                <div ref={positionDisplayRef} className={style.positionDisplay}></div>
            ) : null}
        </div>
    );
};

export default FunscriptPreview;

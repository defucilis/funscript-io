import React, { useState, useEffect, useRef } from "react";

import { Funscript } from "funscript-utils/lib/types";
import { renderActions, ActionsOptions } from "funscript-utils/lib/funMapper";

const FunscriptPreview = ({
    funscripts,
    width,
    height,
    options,
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
    hoverDisplayDuration?: number;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onMouseMove?: (pos: { x?: number; y?: number; localX?: number; localY?: number }) => void;
    onWheel?: (e: React.WheelEvent<HTMLCanvasElement>) => void;
}) => {
    const parentRef = useRef<HTMLDivElement>();
    const canvasRef = useRef<HTMLCanvasElement>();
    const overlayRef = useRef<HTMLDivElement>();
    const [localMousePos, setLocalMousePos] = useState<{ x: number; y: number }>(null);
    const [funscriptDuration, setFunscriptDuration] = useState(1);

    useEffect(() => {
        if (canvasRef.current) {
            if (funscripts.length > 0) {
                for (let i = 0; i < funscripts.length; i++) {
                    if (options[i]) renderActions(canvasRef.current, funscripts[i], options[i]);
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

    return (
        <div
            ref={parentRef}
            style={{
                position: "relative",
                width: { width } + "px",
                height: { height } + "px",
            }}
        >
            <canvas
                width={width}
                height={height}
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
            <div
                ref={overlayRef}
                style={{
                    position: "absolute",
                    top: "-1px",
                    height: "100%",
                    border: "1px solid white",
                    pointerEvents: "none",
                }}
            ></div>
        </div>
    );
};

export default FunscriptPreview;

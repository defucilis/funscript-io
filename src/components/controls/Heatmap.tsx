import React, { useState, useEffect, useRef } from "react";

import { Funscript } from "funscript-utils/lib/types";
import renderHeatmap, { HeatmapOptions } from "funscript-utils/lib/funMapper";

const FunscriptHeatmap = ({
    funscript,
    width,
    height,
    options,
    hoverDisplayDuration,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    onWheel,
}: {
    funscript: Funscript;
    width: number;
    height: number;
    options?: HeatmapOptions;
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
            if (funscript) {
                if (options) renderHeatmap(canvasRef.current, funscript, options);
                else renderHeatmap(canvasRef.current, funscript);
            } else {
                canvasRef.current.getContext("2d").clearRect(0, 0, width, height);
            }
        }
        setFunscriptDuration(funscript ? funscript.actions.slice(-1)[0].at : 1);
    }, [funscript, height, width, options]);

    useEffect(() => {
        if (!localMousePos) {
            overlayRef.current.style.setProperty("display", "none");
            return;
        }
        overlayRef.current.style.setProperty("display", "block");
        const durationAsWidth = (hoverDisplayDuration / funscript.actions.slice(-1)[0].at) * width;
        const min = Math.max(0, localMousePos.x * width - durationAsWidth * 0.5);
        overlayRef.current.style.setProperty("left", min + "px");
        overlayRef.current.style.setProperty("width", durationAsWidth + "px");
    }, [funscript.actions, hoverDisplayDuration, localMousePos, width]);

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

export default FunscriptHeatmap;

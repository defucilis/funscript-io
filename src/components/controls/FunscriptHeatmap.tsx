import React, { useState, useEffect, useRef } from "react";

import { Funscript } from "funscript-utils/lib/types";
import { renderHeatmap, HeatmapOptions } from "funscript-utils/lib/funMapper";

const getOffset = (el: any) => {
    let _x = 0;
    let _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
};

export interface Position {
    x: number;
    y: number;
}

const FunscriptHeatmap = ({
    funscript,
    width,
    height,
    options,
    hoverDisplayDuration,
    playbackTime,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    onWheel,
    onClick,
}: {
    funscript: Funscript;
    width: number;
    height: number;
    options?: HeatmapOptions;
    hoverDisplayDuration?: number;
    playbackTime?: number;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onMouseMove?: (pos: Position) => void;
    onWheel?: (e: React.WheelEvent<HTMLCanvasElement>) => void;
    onClick?: (pos: Position) => void;
}) => {
    const parentRef = useRef<HTMLDivElement>();
    const canvasRef = useRef<HTMLCanvasElement>();
    const overlayRef = useRef<HTMLDivElement>();
    const playbackRef = useRef<HTMLDivElement>();
    const [localMousePos, setLocalMousePos] = useState<Position>(null);
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
            const newPos: Position = { x: localX, y: localMousePos.y };
            setLocalMousePos(newPos);
            onMouseMove(newPos);
        } else if (localX * funscriptDuration + hoverDisplayDuration * 0.5 > funscriptDuration) {
            localX = (funscriptDuration - hoverDisplayDuration * 0.5) / funscriptDuration;
            const newPos: Position = { x: localX, y: localMousePos.y };
            setLocalMousePos(newPos);
            onMouseMove(newPos);
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
                    const parentOffset = getOffset(parentRef.current);
                    const newPos: Position = {
                        x: (e.pageX - parentOffset.left + 1) / canvasRef.current.width,
                        y: (e.pageY - parentOffset.top + 1) / canvasRef.current.height,
                    };
                    if (onMouseMove) onMouseMove(newPos);
                    setLocalMousePos(newPos);
                }}
                onWheel={e => {
                    if (onWheel) onWheel(e);
                }}
                onClick={e => {
                    const parentOffset = getOffset(parentRef.current);
                    const newPos: Position = {
                        x: (e.pageX - parentOffset.left + 1) / canvasRef.current.width,
                        y: (e.pageY - parentOffset.top + 1) / canvasRef.current.height,
                    };
                    if (onClick) onClick(newPos);
                    setLocalMousePos(newPos);
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
            {playbackTime === undefined ? null : (
                <div
                    ref={playbackRef}
                    style={{
                        position: "absolute",
                        height: "100%",
                        backgroundColor: "#FFF",
                        width: "2px",
                        left: `calc(${(100 * playbackTime * 1000) / funscriptDuration}% - 1px)`,
                        top: "0px",
                        pointerEvents: "none",
                    }}
                ></div>
            )}
        </div>
    );
};

export default FunscriptHeatmap;

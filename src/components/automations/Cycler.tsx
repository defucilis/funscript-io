import { useCallback, useEffect, useRef, useState } from "react";

import useHandy from "thehandy-react";
import useAnim from "../../lib/useAnim";

export interface CyclerOptions {
    minSpeed: number;
    maxSpeed: number;
    cycleDuration: number;
    sessionDuration: number;
    setSpeedInterval: number;
    easeInLength: number;
}

const Cycler = ({
    enabled,
    options = {
        minSpeed: 20,
        maxSpeed: 80,
        cycleDuration: 60,
        sessionDuration: 0,
        setSpeedInterval: 0.5,
        easeInLength: 50,
    },
    onSpeedChanged,
}: {
    enabled: boolean;
    options: CyclerOptions;
    onSpeedChanged?: (speed: number) => void;
}): JSX.Element => {
    const { handy } = useHandy();
    const nextCommandTime = useRef<number>(0);
    const [values, setValues] = useState({ runTime: 0, deltaTime: 0, nextCommandTime: 0 });

    const [currentSpeed, setCurrentSpeed] = useState(0);

    const setMode = useCallback(
        async (mode: number) => {
            try {
                await handy.setMode(mode);
            } catch (error) {
                console.error(error);
            }
        },
        [handy]
    );

    const sendNewSpeed = useCallback(
        async (speed: number) => {
            try {
                await handy.setSpeed(speed);
            } catch (error) {
                console.error(error);
            }
        },
        [handy]
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sendNewStroke = useCallback(
        async (stroke: number) => {
            try {
                await handy.setStroke(stroke);
            } catch (error) {
                console.error(error);
            }
        },
        [handy]
    );

    useEffect(() => {
        sendNewSpeed(currentSpeed);
        if (onSpeedChanged) onSpeedChanged(currentSpeed);
    }, [currentSpeed, onSpeedChanged, sendNewSpeed]);

    const easeIn = (t: number) => {
        return Math.pow(t, 2.5);
    };

    const easeOut = (t: number) => {
        t = 1.0 - t;
        return Math.pow(t, 2.5);
    };

    useEffect(() => {
        setMode(enabled ? 1 : 0);
        if (enabled) nextCommandTime.current = -10;
    }, [enabled, setMode]);

    const animationCallback = (runTime: number, deltaTime: number) => {
        //console.log({runTime, next: nextCommandTime.current})

        if (!enabled) {
            nextCommandTime.current += deltaTime;
        }

        if (runTime > values.runTime + 1) {
            setValues({
                runTime,
                deltaTime,
                nextCommandTime: nextCommandTime.current,
            });
        }

        if (!enabled) return;

        if (nextCommandTime.current < 0) nextCommandTime.current = runTime;

        if (runTime > nextCommandTime.current) {
            const afterFinish =
                options.sessionDuration > 0 && runTime > options.sessionDuration * 60;
            const longAfterFinish =
                afterFinish && runTime > options.sessionDuration * 60 + options.cycleDuration;
            const cycleX = (runTime % options.cycleDuration) / options.cycleDuration;
            let cycleValue: number;
            if (longAfterFinish) cycleValue = 1.0;
            else {
                const threshold = options.easeInLength / 100;
                let inMul, outMul: number;
                // Corner cases that would otherwise give us div by zero errors
                if (threshold === 0) {
                    inMul = 0;
                    outMul = 1;
                } else if (threshold === 1) {
                    inMul = 1;
                    outMul = 0;
                } else {
                    inMul = Math.pow(threshold, -1);
                    outMul = Math.pow(1 - threshold, -1);
                }

                if (cycleX < threshold) cycleValue = easeIn(cycleX * inMul);
                else cycleValue = afterFinish ? 1.0 : easeOut((cycleX - threshold) * outMul);
            }

            //console.log({options, afterFinish, longAfterFinish, cycleX, cycleValue});

            const speed = Math.round(
                options.minSpeed + (options.maxSpeed - options.minSpeed) * cycleValue
            );
            if (speed !== currentSpeed) setCurrentSpeed(speed);

            nextCommandTime.current += options.setSpeedInterval;
        }
    };
    useAnim(animationCallback, [enabled, options]);

    return null;
};

export default Cycler;

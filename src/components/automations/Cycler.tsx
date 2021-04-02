import { useCallback, useEffect, useRef, useState } from "react";

import useHandy from "../../lib/HandyReact";
import useAnim from "../../lib/useAnim";

export interface CyclerOptions {
    minSpeed: number;
    maxSpeed: number;
    cycleDuration: number;
    sessionDuration: number;
    setSpeedInterval: number;
}

const Cycler = ({
    enabled,
    options = {
        minSpeed: 20,
        maxSpeed: 80,
        cycleDuration: 60,
        sessionDuration: 0,
        setSpeedInterval: 0.5
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
            await handy.setMode(mode);
        },
        [handy]
    );

    const sendNewSpeed = useCallback(
        async (speed: number) => {
            await handy.setSpeed(speed);
        },
        [handy]
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sendNewStroke = useCallback(
        async (stroke: number) => {
            await handy.setStroke(stroke);
        },
        [handy]
    );

    useEffect(() => {
        sendNewSpeed(currentSpeed);
        if(onSpeedChanged) onSpeedChanged(currentSpeed);
    }, [currentSpeed, onSpeedChanged, currentSpeed])

    const easeIn = (t: number) => {
        return Math.pow(t, 2.5);
    }

    const easeOut = (t: number) => {
        t = 1.0 - t;
        return Math.pow(t, 2.5);
    }

    useEffect(() => {
        setMode(enabled ? 1 : 0);
    }, [enabled]);

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

        if (runTime > nextCommandTime.current) {
            const afterFinish = options.sessionDuration > 0 && runTime > (options.sessionDuration * 60);
            const longAfterFinish = afterFinish && runTime > ((options.sessionDuration * 60) + options.cycleDuration);
            const cycleX = (runTime % options.cycleDuration) / options.cycleDuration;
            let cycleValue: number;
            if(longAfterFinish) cycleValue = 1.0;
            else {
                if(cycleX < 0.5) cycleValue = easeIn(cycleX * 2);
                else cycleValue = afterFinish ? 1.0 : easeOut((cycleX - 0.5) * 2);
            }

            console.log({options, afterFinish, longAfterFinish, cycleX, cycleValue});

            const speed = Math.round(options.minSpeed + (options.maxSpeed - options.minSpeed) * cycleValue);
            if(speed !== currentSpeed) setCurrentSpeed(speed);

            nextCommandTime.current += options.setSpeedInterval;
        }
    };
    useAnim(animationCallback, [enabled, options]);

    return null;
};

export default Cycler;

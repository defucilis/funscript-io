import { useCallback, useRef, useState } from "react";

import useHandy from "thehandy-react";
import useAnim from "../../lib/useAnim";

export interface RandomizeOptions {
    randomizeFrequency: number;
    frequencyVariability: number;
    randomizeSpeedAmount: number;
    randomizeStrokeAmount: number;
}

const Randomizer = ({
    enabled,
    currentStrokeLength,
    currentStrokeSpeed,
    options,
}: {
    enabled: boolean;
    currentStrokeLength: number;
    currentStrokeSpeed: number;
    options: RandomizeOptions;
}): JSX.Element => {
    const { handy } = useHandy();
    const nextCommandTime = useRef<number>(0);
    const [values, setValues] = useState({ runTime: 0, deltaTime: 0, nextCommandTime: 0 });

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
            const speedOffset = (Math.random() * 2 - 1) * options.randomizeSpeedAmount;
            const strokeOffset = (Math.random() * 2 - 1) * options.randomizeStrokeAmount;
            const timeOffset = (Math.random() * 2 - 1) * options.frequencyVariability;

            const newSpeed = Math.min(100, Math.max(0, currentStrokeSpeed + speedOffset));
            const newStroke = Math.min(100, Math.max(0, currentStrokeLength + strokeOffset));
            const newTime = Math.max(2, timeOffset + options.randomizeFrequency);

            sendNewSpeed(newSpeed);
            sendNewStroke(newStroke);
            nextCommandTime.current += newTime;
        }
    };
    useAnim(animationCallback, [enabled, currentStrokeLength, currentStrokeSpeed, options]);

    return null;
};

export default Randomizer;

import { useRef, useEffect } from "react";

const useAnim = (callback?: (runTime: number, deltaTime: number) => void, dependencies?: any[]) => {
    const animationRef = useRef<number>();
    const prevTimeRef = useRef<number>();
    const startTimeRef = useRef<number>();

    const runAnim = (time: number) => {
        if (!startTimeRef.current) startTimeRef.current = time;

        const deltaTime = (time - (prevTimeRef.current || 0)) / 1000.0;
        const runTime = (time - startTimeRef.current) / 1000.0;
        if (callback) callback(runTime, deltaTime);

        prevTimeRef.current = time;
        animationRef.current = requestAnimationFrame(runAnim);
    };

    useEffect(() => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }

        animationRef.current = requestAnimationFrame(runAnim);

        return () => cancelAnimationFrame(animationRef.current);
        // eslint-disable-next-line
    }, [...dependencies, runAnim] || [runAnim]);
};

export default useAnim;

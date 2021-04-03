import React, { ReactNode } from "react";

const ProgressBar = ({
    className,
    innerClassName,
    progress,
    children,
}: {
    className?: string;
    innerClassName?: string;
    progress?: number;
    children?: ReactNode;
}): JSX.Element => {
    return (
        <div
            className={className}
            style={{
                position: "relative",
                display: "grid",
                placeItems: "center",
            }}
        >
            <div
                className={innerClassName}
                style={{
                    height: "100%",
                    width: `${Math.round(progress * 100)}%`,
                    position: "absolute",
                    left: 0,
                    top: 0,
                }}
            ></div>
            {children}
        </div>
    );
};

export default ProgressBar;

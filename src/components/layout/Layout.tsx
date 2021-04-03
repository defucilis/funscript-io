import React, { ReactNode, useEffect, useState } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";

import style from "./Layout.module.scss";
import MobileWarning from "./MobileWarning";

const Layout = ({ children }: { children: ReactNode }) => {
    const [wideEnough, setWideEnough] = useState(true);

    useEffect(() => {
        const handleResize = () => setWideEnough(window.innerWidth > 900);

        window.addEventListener("resize", handleResize);
        setWideEnough(window.innerWidth > 900);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <Header />
            <div className={style.layout}>
                {wideEnough ? <Sidebar /> : null}
                {wideEnough ? <div className={style.container}>{children}</div> : <MobileWarning />}
            </div>
        </>
    );
};

export default Layout;

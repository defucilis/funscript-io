import React, { ReactNode } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import style from './Layout.module.scss'

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Navbar />
            <div className={style.layout}>
                <Sidebar />
                <div className={style.container}>{children}</div>
            </div>
        </>
    );
};

export default Layout;

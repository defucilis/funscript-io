import React from "react";
import { Link } from "react-router-dom";

import style from "./Navbar.module.scss";

const Navbar = () => {
    return (
        <nav className={style.mainNav}>
            <div className={style.logo}>
                <div>
                    <Link to={`/`}>
                        funscript.io<span className={style.versionNumber}>v0.0.1</span>
                    </Link>
                </div>
            </div>
            <ul>
                <p>Things can go here</p>
            </ul>
        </nav>
    );
};

export default Navbar;

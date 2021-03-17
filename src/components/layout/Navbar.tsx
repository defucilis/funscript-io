import React from "react";
import { Link } from "react-router-dom";

import { version } from "../../../package.json";
import style from "./Navbar.module.scss";

const Navbar = () => {
    return (
        <nav className={style.mainNav}>
            <div className={style.logo}>
                <div>
                    <Link to={`/`}>
                        funscript.io<span className={style.versionNumber}>v{version}</span>
                    </Link>
                </div>
            </div>
            <ul>
                <li>
                    <p>Things can go here</p>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;

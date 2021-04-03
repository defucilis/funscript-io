import React from "react";
import { Link } from "react-router-dom";

import {FaGithub} from 'react-icons/fa'

import { version } from "../../../package.json";
import style from "./Header.module.scss";

const Header = () => {
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
                    <a className={style.github} href={"https://github.com/defucilis/funscript-io"} target="_blank">
                        <FaGithub />
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default Header;

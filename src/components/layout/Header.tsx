import React from "react";
import { Link } from "react-router-dom";

import {FaGithub} from 'react-icons/fa'

import { version } from "../../../package.json";
import style from "./Header.module.scss";
import EroScripts from "../utility/Eroscripts";

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
                <li className={style.iconLink}>
                    <a href={"https://github.com/defucilis/funscript-io"} rel="noopener noreferrer" target="_blank">
                        <FaGithub />
                    </a>
                </li>
                <li className={style.iconLink}>
                    <a href={"https://discuss.eroscripts.com/t/funscript-io-a-website-for-playing-modifying-and-generating-funscripts/20624"} rel="noopener noreferrer" target="_blank">
                        <EroScripts />
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default Header;

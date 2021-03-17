import React from "react";
import style from "./Footer.module.scss";
import { version } from "../../../package.json";

const Footer = (): JSX.Element => {
    return (
        <div className={style.footer}>
            <div className="container">
                <p>Funscript.io Version {version}</p>
                <p>&copy; FunscriptIO 2021</p>
            </div>
        </div>
    );
};

export default Footer;

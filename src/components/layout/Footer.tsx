import React from "react";
import style from "./Footer.module.scss";
import packageJson from "../../../package.json";

const Footer = (): JSX.Element => {
    return (
        <div className={style.footer}>
            <div className="container">
                <p>Funscript.io Version {packageJson.version}</p>
                <p>&copy; FunscriptIO 2023</p>
            </div>
        </div>
    );
};

export default Footer;

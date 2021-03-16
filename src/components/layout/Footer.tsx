import React from "react";
import style from "./Footer.module.scss";

const Footer = (): JSX.Element => {
    return (
        <div className={style.footer}>
            <div className="container">
                <p>Funscript.io Version 0.1.0</p>
                <p>&copy; FunscriptIO 2021</p>
            </div>
        </div>
    );
};

export default Footer;

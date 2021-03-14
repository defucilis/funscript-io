import React from "react";
import { Link } from "react-router-dom";

import { MdHome, MdOndemandVideo, MdTune, MdLink, MdCheckCircle } from "react-icons/md";

import style from "./Sidebar.module.scss";
import Footer from "./Footer";

const Sidebar = () => {
    return (
        <div className={style.sidebar}>
            <div>
                <ul className={style.sidebarNav}>
                    <li>
                        <Link to={`/`}>
                            <span className={style.navIcon}>
                                <MdHome />
                            </span>
                            <span className={style.navText}>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={`/play`}>
                            <span className={style.navIcon}>
                                <MdOndemandVideo />
                            </span>
                            <span className={style.navText}>Play local script</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={`/manual`}>
                            <span className={style.navIcon} style={{ top: 0 }}>
                                M
                            </span>
                            <span className={style.navText}>Manual mode</span>
                        </Link>
                    </li>
                    <li>
                        <a href="https://scriptaxis.com" target="_blank" rel="noopener noreferrer">
                            <span className={style.navIcon}>
                                <MdLink />
                            </span>
                            <span className={style.navText}>Find more scripts</span>
                        </a>
                    </li>
                    <li>
                        <Link to={`/modify`}>
                            <span className={style.navIcon}>
                                <MdTune />
                            </span>
                            <span className={style.navText}>Modify script</span>
                        </Link>
                    </li>
                </ul>
                <ul className={style.sidebarNav}>
                    <li>
                        <p>
                            <span
                                className={style.navIcon}
                                style={{ color: "var(--color-green-600)" }}
                            >
                                <MdCheckCircle />
                            </span>
                            <span className={style.navText}>Handy Connected</span>
                        </p>
                    </li>
                </ul>
            </div>
            <Footer />
        </div>
    );
};

export default Sidebar;

import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { MdHome, MdOndemandVideo, MdTune, MdLink, MdList } from "react-icons/md";

import HandyConnection from "../HandyConnection";
import style from "./Sidebar.module.scss";
import Footer from "./Footer";

const Sidebar = () => {
    const location = useLocation();

    return (
        <div className={style.sidebar}>
            <div>
                <ul className={style.sidebarNav}>
                    <li className={location.pathname === "/" ? style.selected : null}>
                        <Link to={`/`}>
                            <span className={style.navIcon}>
                                <MdHome />
                            </span>
                            <span className={style.navText}>Home</span>
                        </Link>
                    </li>
                    <li className={location.pathname === "/play" ? style.selected : null}>
                        <Link to={`/play`}>
                            <span className={style.navIcon}>
                                <MdOndemandVideo />
                            </span>
                            <span className={style.navText}>Play local script</span>
                        </Link>
                    </li>
                    <li className={location.pathname === "/manual" ? style.selected : null}>
                        <Link to={`/manual`}>
                            <span className={style.navIcon} style={{ top: 0 }}>
                                M
                            </span>
                            <span className={style.navText}>Manual mode</span>
                        </Link>
                    </li>
                    <li className={location.pathname === "/auto" ? style.selected : null}>
                        <Link to={`/auto`}>
                            <span className={style.navIcon} style={{ top: 0 }}>
                                A
                            </span>
                            <span className={style.navText}>Auto mode</span>
                        </Link>
                    </li>
                    <li className={location.pathname === "/modify" ? style.selected : null}>
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
                        <HandyConnection />
                    </li>
                </ul>
                <ul className={style.sidebarNav}>
                    <li
                        className={location.pathname === "/browse" ? style.selected : null}
                        style={{ height: "4rem" }}
                    >
                        <a href="https://scriptaxis.com" target="_blank" rel="noopener noreferrer">
                            <span className={style.navIcon}>
                                <MdLink />
                            </span>
                            <span className={style.navText}>
                                Find more scripts at ScriptAxis.com
                            </span>
                        </a>
                    </li>
                </ul>
            </div>
            <div>
                <ul className={`${style.sidebarNav} ${style.sidebarNavFooter}`}>
                    <li className={location.pathname === "/changelog" ? style.selected : null}>
                        <Link to={`/changelog`}>
                            <span className={style.navIcon}>
                                <MdList />
                            </span>
                            <span className={style.navText}>Changelog</span>
                        </Link>
                    </li>
                </ul>
                <Footer />
            </div>
        </div>
    );
};

export default Sidebar;

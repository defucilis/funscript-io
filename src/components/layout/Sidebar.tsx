import React from 'react'
import {Link} from 'react-router-dom'

import {MdHome, MdOndemandVideo, MdExplore, MdTune} from 'react-icons/md'

import style from "./Sidebar.module.scss"
import Footer from './Footer'

const Sidebar = () => {
    return (
        <div className={style.sidebar}>
            <div>
                <ul className={style.sidebarNav}>
                    <li>
                        <Link to={`/`}>
                            <span className={style.navIcon}><MdHome /></span>
                            <span className={style.navText}>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={`/`}>
                            <span className={style.navIcon}><MdOndemandVideo /></span>
                            <span className={style.navText}>Play local script</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={`/`}>
                            <span className={style.navIcon}><MdExplore /></span>
                            <span className={style.navText}>Find more scripts</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={`/`}>
                            <span className={style.navIcon}><MdTune /></span>
                            <span className={style.navText}>Modify script</span>
                        </Link>
                    </li>
                </ul>
            </div>
            <Footer />
        </div>
    )
}

export default Sidebar;
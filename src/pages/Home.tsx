import React from "react";

import Layout from "../components/layout/Layout";
import StackedContentPage from "../components/layout/StackedContentPage";

import style from "./Home.module.scss";

const Home = () => {
    return (
        <Layout>
            <StackedContentPage>
                <div className={style.home}>
                    <img src="logo512.png" width={300} height={300} alt="Funscript.io Logo" />
                    <h1>Funscript.io</h1>
                    <ul>
                        <li>Create Funscripts</li>
                        <li>Modify Funscripts</li>
                        <li>Enjoy Funscripts</li>
                    </ul>
                </div>
            </StackedContentPage>
        </Layout>
    );
};

export default Home;

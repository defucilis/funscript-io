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
                    <p
                        style={{
                            marginTop: "3rem",
                            marginBottom: 0,
                            fontSize: "1.5rem",
                            color: "#f1a7c1",
                            fontWeight: "bold",
                        }}
                    >
                        Funscript.io Version 2 is now in beta!
                    </p>
                    <p>
                        <span style={{ fontStyle: "italic" }}>
                            With support for Handy Firmware V3, Handy API V2, mobile screen sizes
                            and many,
                            <br />
                            many other new features and improvements, Funscript.io 2 is better in
                            every way!
                        </span>
                        <br />
                        <br />
                        <a
                            href={`https://beta.funscript.io`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                textDecoration: "underline",
                                color: "#e8739c",
                            }}
                        >
                            Check it out now!
                        </a>
                    </p>
                </div>
            </StackedContentPage>
        </Layout>
    );
};

export default Home;

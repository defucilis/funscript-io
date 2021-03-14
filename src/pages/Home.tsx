import React from "react";

import Layout from "../components/layout/Layout";
import StackedContentPage from "../components/layout/StackedContentPage";
import useHandy from "../lib/thehandy/src/TheHandy";

const Home = () => {
    const { handy } = useHandy();

    console.log(handy.connectionKey);

    const getVersion = async () => {
        handy.connectionKey = "Eepan";
        console.log("Geting handy version");
        try {
            const version = await handy.getVersion();
            console.log(version);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Layout>
            <StackedContentPage>
                <h1>Funscript.io</h1>
                <p>
                    This site contains a variety of tools and utilities for the creation,
                    modification and consumption of Funscripts
                </p>
                <button onClick={() => getVersion()}>Get Version</button>
            </StackedContentPage>
        </Layout>
    );
};

export default Home;

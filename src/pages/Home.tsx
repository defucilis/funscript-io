import React from "react";

import Layout from "../components/layout/Layout";
import StackedContentPage from "../components/layout/StackedContentPage";

const Home = () => {
    return (
        <Layout>
            <StackedContentPage>
                <h1>Funscript.io</h1>
                <p>
                    This site contains a variety of tools and utilities for the creation,
                    modification and consumption of Funscripts
                </p>
            </StackedContentPage>
        </Layout>
    );
};

export default Home;

import React from "react";
import Layout from "../components/layout/Layout";
import useHandy from "../lib/thehandy/src/TheHandy";

const Play = () => {
    const { handy } = useHandy();

    console.log(handy.connectionKey);

    return (
        <Layout>
            <div>
                <h1>Modify Local Funscript</h1>
            </div>
        </Layout>
    );
};

export default Play;

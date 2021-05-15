import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Layout from "../components/layout/Layout";
import StackedContentPage from "../components/layout/StackedContentPage";

import ChangelogContent from "../lib/CHANGELOG";

import style from "./Changelog.module.scss";

//this is a temporary version!
const Changelog = (): JSX.Element => {
    useEffect(() => {
        console.log("fetching");
        fetch("./test.txt").then(val => {
            val.text().then(text => {
                console.log(text);
            });
        });
    }, []);

    return (
        <Layout>
            <StackedContentPage>
                <h1>Changelog</h1>
                <div className={style.changelog}>
                    <ReactMarkdown children={ChangelogContent} />
                </div>
            </StackedContentPage>
        </Layout>
    );
};

export default Changelog;

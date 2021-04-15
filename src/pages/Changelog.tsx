import React from "react";
import Layout from "../components/layout/Layout";
import StackedContentPage from "../components/layout/StackedContentPage";

import style from "./Changelog.module.scss";

//this is a temporary version!
const Changelog = (): JSX.Element => {
    return (
        <Layout>
            <StackedContentPage>
                <h1>Changelog</h1>
                <div className={style.changelog}>
                    <div>
                        <h2>v0.5.0</h2>
                        <p className={style.date}>15th April 2021</p>
                        <h3>Added</h3>
                        <ul>
                            <li>
                                Added Limiter modifier to ensure a script matches a device&apos;s
                                capabilities
                            </li>
                            <li>Space bar now pauses/unpauses the local script player</li>
                            <li>
                                Left/Right arrow keys now seek 10s back/forward in the local script
                                player (suggestion by spuzz1127)
                            </li>
                            <li>
                                It is now possible to change the stroke speed/length increment
                                amounts in manual mode (suggestion by Jupiter)
                            </li>
                            <li>Added this changelog page!</li>
                        </ul>
                        <h3>Changed</h3>
                        <ul>
                            <li>
                                Up/Down arrow keys are now used instead of left/right to change sync
                                offset in the local script player
                            </li>
                        </ul>
                        <h3>Fixed</h3>
                        <ul>
                            <li>
                                Heatmaps now show gaps in the funscript (rather than continuing the
                                color that was before the gap)
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2>v0.4.1</h2>
                        <p className={style.date}>11th April 2021</p>
                        <h3>Fixed</h3>
                        <ul>
                            <li>Stopped overwriting funscript metadata, oops! (thanks sentinel)</li>
                        </ul>
                    </div>
                    <div>
                        <h2>v0.4.0</h2>
                        <p className={style.date}>4th April 2021</p>
                        <h3>Features</h3>
                        <ul>
                            <li>A better local-video script player than handyfeeling.com</li>
                            <li>Easy to use script-modification features</li>
                            <li>A better manual-mode interface</li>
                            <li>Procedural funscript generation</li>
                        </ul>
                    </div>
                </div>
            </StackedContentPage>
        </Layout>
    );
};

export default Changelog;

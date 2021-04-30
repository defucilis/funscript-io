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
                        <h2>v0.7.2</h2>
                        <p className={style.date}>29th April 2021</p>
                        <h3>Fixed</h3>
                        <ul>
                            <li>
                                Fixed a bug where under certain circumstances, funscripts would
                                report invalid values for Average Speed
                            </li>
                            <li>
                                Made it possible to refresh the page when in sub-pages (like
                                /modify) without getting a 404 error
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2>v0.7.1</h2>
                        <p className={style.date}>28th April 2021</p>
                        <h3>Fixed</h3>
                        <ul>
                            <li>
                                Solved a crash when attempting to edit the metadata of a script
                                without existing performers or tags keys
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2>v0.7.0</h2>
                        <p className={style.date}>18th April 2021</p>
                        <h3>Added</h3>
                        <ul>
                            <li>
                                Funscripts can now have their metadata edited in the Modify page
                            </li>
                            <li>Added ScriptAxis top scripts browser to the Browse page!</li>
                        </ul>
                    </div>
                    <div>
                        <h2>v0.6.1</h2>
                        <p className={style.date}>18th April 2021</p>
                        <h3>Fixed</h3>
                        <ul>
                            <li>
                                Funscript popups now filter for .funscript files (suggestion by
                                spuzz1127)
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2>v0.6.0</h2>
                        <p className={style.date}>16th April 2021</p>
                        <h3>Added (suggestions by spuzz1127)</h3>
                        <ul>
                            <li>Video playback can now be toggled by clicking the video</li>
                            <li>
                                Clicking the heatmap preview in the local player seeks through the
                                video
                            </li>
                            <li>
                                Funscripts can be previewed during playback by clicking the small
                                funscript button on the bottom right of the player
                                <br />
                                Doesn&apos;t work in fullscreen mode
                            </li>
                        </ul>
                    </div>
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

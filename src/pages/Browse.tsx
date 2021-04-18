import React, { useState, useEffect } from "react";

import axios from "axios";
import { FaCog } from "react-icons/fa";

import style from "./Browse.module.scss";
import dayjs from "dayjs";
import Layout from "../components/layout/Layout";
import { Script } from "../lib/types";
import ScriptGrid from "../components/scripts/ScriptGrid";
import SingleScreenPage from "../components/layout/SingleScreenPage";

type TimePeriod = "week" | "month" | "year" | "alltime";
type OrderByMethod = "likeCount" | "views";

const timePeriodToUnixMilliseconds = (timePeriod: TimePeriod): number => {
    switch (timePeriod) {
        case "week":
            return dayjs().subtract(1, "week").valueOf();
        case "month":
            return dayjs().subtract(1, "month").valueOf();
        case "year":
            return dayjs().subtract(1, "year").valueOf();
    }
    return 0;
};

const getTitle = (orderBy: OrderByMethod, timePeriod: TimePeriod): string => {
    let output = "";
    if (orderBy === "likeCount") output += "Most liked scripts ";
    else output += "Most viewed scripts ";

    switch (timePeriod) {
        case "week":
            output += "from the last week";
            break;
        case "month":
            output += "from the last month";
            break;
        case "year":
            output += "from the last year";
            break;
        case "alltime":
            output += "(all time)";
            break;
    }

    return output;
};

const Browse = ({ initialScripts }: { initialScripts?: Script[] }): JSX.Element => {
    const [loading, setLoading] = useState(initialScripts ? false : true);
    const [error, setError] = useState("");
    const [scripts, setScripts] = useState<Script[]>(initialScripts || []);
    const [orderBy, setOrderBy] = useState<OrderByMethod>("likeCount");
    const [timePeriod, setTimePeriod] = useState<TimePeriod>("week");

    useEffect(() => {
        const fetchScripts = async () => {
            try {
                const topScriptsTime = window.localStorage.getItem("topScriptsTime");
                if (
                    topScriptsTime &&
                    orderBy === "likeCount" &&
                    timePeriod === "week" &&
                    Number(topScriptsTime) > new Date().valueOf() - 604800000
                ) {
                    const scripts = window.localStorage.getItem("topScripts");
                    try {
                        setScripts(JSON.parse(scripts));
                        setLoading(false);
                        return;
                    } catch (error) {
                        console.error(error);
                    }
                }

                setLoading(true);
                const response = await axios.post(
                    "https://script-axis-git-develop-defucilis.vercel.app/api/scripts",
                    {
                        take: 8,
                        orderBy: { [orderBy]: "desc" },
                        minDate: timePeriodToUnixMilliseconds(timePeriod),
                    }
                );
                console.log(response.data);
                if (response.data.error) throw response.data.error;
                setScripts(response.data);
                if (orderBy === "likeCount" && timePeriod === "week") {
                    //this is just so the index page loads faster - we shouldn't overwrite if we change the ordering or filtering info!
                    window.localStorage.setItem("topScripts", JSON.stringify(response.data));
                    window.localStorage.setItem("topScriptsTime", new Date().valueOf().toString());
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchScripts();
    }, [orderBy, timePeriod]);

    return (
        <Layout>
            <SingleScreenPage>
                <h1>{getTitle(orderBy, timePeriod)}</h1>
                <div className={style.topSelectionMethods}>
                    <ul>
                        <li
                            className={orderBy === "likeCount" ? style.selected : null}
                            onClick={() => {
                                setOrderBy("likeCount");
                            }}
                        >
                            Likes
                        </li>
                        <li
                            className={orderBy === "views" ? style.selected : null}
                            onClick={() => {
                                setOrderBy("views");
                            }}
                        >
                            Views
                        </li>
                    </ul>
                    <ul>
                        <li
                            className={timePeriod === "week" ? style.selected : null}
                            onClick={() => {
                                setTimePeriod("week");
                            }}
                        >
                            Week
                        </li>
                        <li
                            className={timePeriod === "month" ? style.selected : null}
                            onClick={() => {
                                setTimePeriod("month");
                            }}
                        >
                            Month
                        </li>
                        <li
                            className={timePeriod === "year" ? style.selected : null}
                            onClick={() => {
                                setTimePeriod("year");
                            }}
                        >
                            Year
                        </li>
                        <li
                            className={timePeriod === "alltime" ? style.selected : null}
                            onClick={() => {
                                setTimePeriod("alltime");
                            }}
                        >
                            All Time
                        </li>
                    </ul>
                </div>
                {loading ? (
                    <div className={style.indexCenter}>
                        <p>
                            <span>
                                <FaCog className={style.indexLoading} />
                            </span>
                            <span>Loading the top scripts just for you...</span>
                        </p>
                    </div>
                ) : error ? (
                    <p style={{ color: "salmon" }}>{error}</p>
                ) : (
                    <div>
                        <ScriptGrid scripts={scripts} />
                        <a
                            href="https://scriptaxis.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={style.scriptAxisLink}
                        >
                            Get more scripts at ScriptAxis.com
                        </a>
                    </div>
                )}
            </SingleScreenPage>
        </Layout>
    );
};

export default Browse;

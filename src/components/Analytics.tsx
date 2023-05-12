import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useLocation } from "react-router";
import { UAParser } from "ua-parser-js";

const Analytics = (): JSX.Element => {
    const location = useLocation();

    const checkSend = async () => {
        const hasCookie = document.cookie.match("funscriptioL-visitor");

        const ua = new UAParser();
        const site = "V1";
        const browser = ua.getBrowser().name;
        const os = ua.getOS().name;
        const referrer = document.referrer.replace("https://", "").split("/")[0];
        //replace page slashes with semicolons
        const page = window.location.pathname.replace(/\//g, ";");

        //if (process.env.NODE_ENV !== "production") {
        //    return;
        //}

        if (!hasCookie) {
            //we create this temporary 6-hour cookie so that more pageviews
            //in the same browser don't count as a whole new site visitor
            //note that there is nothing actually stored in this cookie, it's
            //just there to tell the browser that this is a single session!
            const cookieContents = "privacy-always";
            const expiry = new Date(new Date().valueOf() + 3600000); //expires in 6 hours
            document.cookie = `funscriptioL-visitor=${cookieContents};expires=${expiry.toUTCString()};path=/;SameSite=Lax;Secure`;
            await axios(
                `https://beta.funscript.io/api/analytics?event=visit&site=${site}&browser=${browser}&os=${os}&referrer=${referrer}&page=${page}`
            );
        } else {
            await axios(
                `https://beta.funscript.io/api/analytics?event=pageview&site=${site}&page=${page}`
            );
        }
    };

    useEffect(() => {
        checkSend();
    }, []);

    useEffect(() => {
        checkSend();
    }, [location]);

    return <div />;
};

export default Analytics;

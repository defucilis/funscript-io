import React from "react";
import * as ReactDOM from "react-dom";
import { Switch, Route, BrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import Play from "./pages/Play";
import Modify from "./pages/Modify";
import Auto from "./pages/Auto";
import Manual from "./pages/Manual";
import Debug from "./pages/Debug";
import Changelog from "./pages/Changelog";

import "./index.scss";
import { HandyProvider } from "thehandy-react";
import Analytics from "./components/Analytics";

ReactDOM.render(
    <React.StrictMode>
        <HandyProvider>
            <BrowserRouter>
                <Switch>
                    <Route exact path={`/`} component={Home} />
                    <Route exact path={`/play`} component={Play} />
                    <Route exact path={`/modify`} component={Modify} />
                    <Route exact path={`/manual`} component={Manual} />
                    <Route exact path={`/auto`} component={Auto} />
                    <Route exact path={`/debug`} component={Debug} />
                    <Route exact path={`/changelog`} component={Changelog} />
                </Switch>
            </BrowserRouter>
        </HandyProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./pages/Home";
import Play from "./pages/Play";
import Modify from "./pages/Modify";
import Auto from "./pages/Auto";
import Manual from "./pages/Manual";
import Debug from "./pages/Debug";
import Changelog from "./pages/Changelog";

function App() {
    return (
        <div className="App">
            <Switch>
                <Route exact path={`/`} component={Home} />
                <Route exact path={`/play`} component={Play} />
                <Route exact path={`/modify`} component={Modify} />
                <Route exact path={`/manual`} component={Manual} />
                <Route exact path={`/auto`} component={Auto} />
                <Route exact path={`/debug`} component={Debug} />
                <Route exact path={`/changelog`} component={Changelog} />
            </Switch>
        </div>
    );
}

export default App;

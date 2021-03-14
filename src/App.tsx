import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./pages/Home";
import Play from "./pages/Play";
import Modify from "./pages/Modify";
import Manual from "./pages/Manual";

function App() {
    return (
        <div className="App">
            <Switch>
                <Route exact path={`/`} component={Home} />
                <Route exact path={`/play`} component={Play} />
                <Route exact path={`/modify`} component={Modify} />
                <Route exact path={`/manual`} component={Manual} />
            </Switch>
        </div>
    );
}

export default App;

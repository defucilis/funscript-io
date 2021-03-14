import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import "./index.scss";
import { HandyProvider } from "thehandy";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <HandyProvider>
                <App />
            </HandyProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);

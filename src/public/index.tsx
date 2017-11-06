import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";

import { App } from "./components/App";

const appHost = () => document.querySelector("#app-host");

const render = (Component: any) =>
    ReactDOM.render(
        <AppContainer>
            <App />
        </AppContainer>
        , appHost());

render(App);

declare const module: any;
if (module.hot) {
    module.hot.accept();
}

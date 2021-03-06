import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";

// components
import Routes from "./routes";

// styles
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css";

// icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faTrash } from '@fortawesome/free-solid-svg-icons'
 
library.add(faBars);
library.add(faTrash);

ReactDOM.render(
    <React.StrictMode>
        <Routes />
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
